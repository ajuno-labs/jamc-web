import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"

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
      votes: true,
      tags: true,
    },
  })
  return question
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
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  return answers
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

  if (existingVote) {
    if (existingVote.value === value) {
      // Remove vote if clicking the same button
      await prisma.questionVote.delete({
        where: {
          id: existingVote.id,
        },
      })

    } else {
      // Update vote if changing from upvote to downvote or vice versa
      await prisma.questionVote.update({
        where: {
          id: existingVote.id,
        },

        data: {
          value,
        },
      })
    }
  } else {
    // Create new vote
    await prisma.questionVote.create({
      data: {
        questionId,
        userId: session.user.id,
        value,
      },
    })

  }

  revalidatePath(`/question/${questionId}`)
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
    }
  } else {
    await prisma.answerVote.create({
      data: {
        answerId,
        userId: session.user.id,
        value,

      },
    })
  }

  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    select: { questionId: true },
  })


  if (answer) {
    revalidatePath(`/question/${answer.questionId}`)
  }
}

export async function getRelatedQuestions(questionId: string) {
  // For now, just get recent questions
  // TODO: Implement proper relevance-based fetching
  const questions = await prisma.question.findMany({
    where: {
      id: {
        not: questionId,
      },
      visibility: "PUBLIC",
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      content: true,
      slug: true,
    },
  })
  return questions
} 