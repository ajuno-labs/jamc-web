"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"
import { calculateUserReputation, checkReputationMilestone } from "@/lib/utils/reputation"
import { notifyNewAnswer, notifyVote, notifyComment } from "@/lib/services/notification-triggers"

export async function getQuestionDetails(id: string) {
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      votes: {
        select: {
          id: true,
          value: true,
          userId: true,
        }
      },
      tags: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
        }
      },
      lesson: {
        select: {
          id: true,
          title: true,
          slug: true,
        }
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    },
  })

  if (!question) return null

  // Calculate author reputation
  const authorReputation = await calculateUserReputation(question.author.id)

  return {
    ...question,
    author: {
      ...question.author,
      reputation: authorReputation
    }
  }
}

export async function getQuestionAnswers(questionId: string) {
  const answers = await prisma.answer.findMany({
    where: { questionId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      votes: {
        select: {
          id: true,
          value: true,
          userId: true,
        }
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Calculate reputation for each answer author
  const answersWithReputation = await Promise.all(
    answers.map(async (answer) => {
      const authorReputation = await calculateUserReputation(answer.author.id)
      return {
        ...answer,
        author: {
          ...answer.author,
          reputation: authorReputation
        }
      }
    })
  )

  return answersWithReputation
}

export async function addAnswer(questionId: string, content: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to answer")
  }

  const answer = await prisma.answer.create({
    data: {
      content,
      authorId: session.user.id,
      questionId,
    },
  })

  // Send notification to question author
  try {
    await notifyNewAnswer(answer.id, session.user.id)
  } catch (error) {
    console.error('Failed to send new answer notification:', error)
    // Don't fail the answer creation if notification fails
  }

  revalidatePath(`/question/${questionId}`)
  return answer
}

export async function voteQuestion(questionId: string, value: 1 | -1) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to vote")
  }

  const existingVote = await prisma.questionVote.findUnique({
    where: {
      questionId_userId: {
        questionId,
        userId: session.user.id,
      },
    },
  })

  // Get question author for milestone check
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { authorId: true, slug: true }
  })

  if (existingVote) {
    if (existingVote.value === value) {
      await prisma.questionVote.delete({
        where: {
          id: existingVote.id,
        },
      })
    } else {
      await prisma.questionVote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          value,
        },
      })
      
      // Send notification for vote change
      try {
        await notifyVote('question', questionId, value, session.user.id)
      } catch (error) {
        console.error('Failed to send vote notification:', error)
      }
    }
  } else {
    await prisma.questionVote.create({
      data: {
        questionId,
        userId: session.user.id,
        value,
      },
    })
    
    // Send notification for new vote
    try {
      await notifyVote('question', questionId, value, session.user.id)
    } catch (error) {
      console.error('Failed to send vote notification:', error)
    }
  }

  // Check for reputation milestone for question author
  if (question?.authorId) {
    try {
      await checkReputationMilestone(question.authorId)
    } catch (error) {
      console.error('Failed to check reputation milestone:', error)
    }
  }

  if (question) {
    // Fix the revalidation path to match the actual route
    revalidatePath(`/questions/${questionId}/${question.slug}`)
  }
}

export async function updateQuestion(questionId: string, title: string, content: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to edit")
  }

  // Check if user owns the question
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { authorId: true, slug: true }
  })

  if (!question || question.authorId !== session.user.id) {
    throw new Error("You can only edit your own questions")
  }

  const updatedQuestion = await prisma.question.update({
    where: { id: questionId },
    data: { title, content }
  })

  revalidatePath(`/questions/${questionId}/${question.slug}`)
  return updatedQuestion
}

export async function updateAnswer(answerId: string, content: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to edit")
  }

  // Check if user owns the answer
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    select: { 
      authorId: true, 
      questionId: true,
      question: {
        select: { slug: true }
      }
    }
  })

  if (!answer || answer.authorId !== session.user.id) {
    throw new Error("You can only edit your own answers")
  }

  const updatedAnswer = await prisma.answer.update({
    where: { id: answerId },
    data: { content }
  })

  revalidatePath(`/questions/${answer.questionId}/${answer.question.slug}`)
  return updatedAnswer
}

export async function addComment(content: string, questionId?: string, answerId?: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to comment")
  }

  if (!questionId && !answerId) {
    throw new Error("Comment must be on either a question or answer")
  }

  if (questionId && answerId) {
    throw new Error("Comment cannot be on both question and answer")
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: session.user.id,
      questionId,
      answerId
    }
  })

  // Send notification to question/answer author
  try {
    await notifyComment(comment.id, session.user.id, questionId, answerId)
  } catch (error) {
    console.error('Failed to send comment notification:', error)
    // Don't fail the comment creation if notification fails
  }

  // Get the question slug for revalidation
  let questionSlug: string
  if (questionId) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { slug: true }
    })
    questionSlug = question?.slug || ""
    revalidatePath(`/questions/${questionId}/${questionSlug}`)
  } else if (answerId) {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: { 
        questionId: true,
        question: { select: { slug: true } }
      }
    })
    if (answer) {
      revalidatePath(`/questions/${answer.questionId}/${answer.question.slug}`)
    }
  }

  return comment
}

export async function voteAnswer(answerId: string, value: 1 | -1) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to vote")
  }

  const existingVote = await prisma.answerVote.findUnique({
    where: {
      answerId_userId: {
        answerId,
        userId: session.user.id,
      },
    },
  })

  // Get answer author for milestone check
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    select: { 
      authorId: true,
      questionId: true,
      question: {
        select: {
          slug: true
        }
      }
    },
  })

  if (existingVote) {
    if (existingVote.value === value) {
      await prisma.answerVote.delete({
        where: {
          id: existingVote.id,
        },
      })
    } else {
      await prisma.answerVote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          value,
        },
      })
      
      // Send notification for vote change
      try {
        await notifyVote('answer', answerId, value, session.user.id)
      } catch (error) {
        console.error('Failed to send vote notification:', error)
      }
    }
  } else {
    await prisma.answerVote.create({
      data: {
        answerId,
        userId: session.user.id,
        value,
      },
    })
    
    // Send notification for new vote
    try {
      await notifyVote('answer', answerId, value, session.user.id)
    } catch (error) {
      console.error('Failed to send vote notification:', error)
    }
  }

  // Check for reputation milestone for answer author
  if (answer?.authorId) {
    try {
      await checkReputationMilestone(answer.authorId)
    } catch (error) {
      console.error('Failed to check reputation milestone:', error)
    }
  }

  if (answer && answer.question) {
    // Fix the revalidation path to match the actual route
    revalidatePath(`/questions/${answer.questionId}/${answer.question.slug}`)
  }
}

export async function getRelatedQuestions(questionId: string, limit = 5) {
  // Tag-based similarity: fetch questions sharing tags, ordered by shared-tag count then recency
  const tagData = await prisma.question.findUnique({
    where: { id: questionId },
    select: { tags: { select: { id: true } } },
  })
  const tagIds = tagData?.tags.map(t => t.id) ?? []

  if (tagIds.length > 0) {
    const primary = await prisma.question.findMany({
      where: {
        id: { not: questionId },
        visibility: "PUBLIC",
        tags: { some: { id: { in: tagIds } } },
      },
      orderBy: [
        { tags: { _count: 'desc' } },
        { createdAt: 'desc' },
      ],
      take: limit,
      select: { id: true, title: true, content: true, slug: true },
    })
    if (primary.length >= limit) return primary

    const secondary = await prisma.question.findMany({
      where: {
        id: { notIn: [questionId, ...primary.map(q => q.id)] },
        visibility: "PUBLIC",
      },
      orderBy: { createdAt: 'desc' },
      take: limit - primary.length,
      select: { id: true, title: true, content: true, slug: true },
    })
    return [...primary, ...secondary]
  }

  // Fallback: most recent public questions
  return prisma.question.findMany({
    where: { id: { not: questionId }, visibility: "PUBLIC" },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, title: true, content: true, slug: true },
  })
} 