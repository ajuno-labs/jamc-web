"use server"

import { getEnhancedPrisma } from "@/lib/db/enhanced"
import { getAuthUser } from "@/lib/auth/get-user"
import { revalidatePath } from "next/cache"
import { notifyAnswerAccepted } from "@/lib/services/notification-triggers"
import { checkReputationMilestone } from "@/lib/utils/reputation"

export async function acceptAnswerByUser(answerId: string) {
  const user = await getAuthUser()
  if (!user) {
    throw new Error("You must be logged in to accept an answer")
  }

  const db = await getEnhancedPrisma()

  // Get the answer with question details
  const answer = await db.answer.findUnique({
    where: { id: answerId },
    include: {
      question: {
        select: {
          id: true,
          slug: true,
          authorId: true,
        }
      }
    }
  })

  if (!answer) {
    throw new Error("Answer not found")
  }

  // Check if the current user is the question owner
  if (answer.question.authorId !== user.id) {
    throw new Error("Only the question owner can accept an answer")
  }

  // First, unaccept any previously accepted answer by this user for this question
  await db.answer.updateMany({
    where: {
      questionId: answer.question.id,
      isAcceptedByUser: true,
    },
    data: {
      isAcceptedByUser: false,
      acceptedByUserAt: null,
    }
  })

  // Accept the new answer
  const updatedAnswer = await db.answer.update({
    where: { id: answerId },
    data: {
      isAcceptedByUser: true,
      acceptedByUserAt: new Date(),
    }
  })

  // Send notification to answer author
  try {
    await notifyAnswerAccepted(answerId, user.id, false)
  } catch (error) {
    console.error('Failed to send answer accepted notification:', error)
    // Don't fail the acceptance if notification fails
  }

  // Check for reputation milestone for answer author
  try {
    await checkReputationMilestone(answer.authorId)
  } catch (error) {
    console.error('Failed to check reputation milestone:', error)
  }

  revalidatePath(`/questions/${answer.question.id}/${answer.question.slug}`)
  return updatedAnswer
}

export async function unacceptAnswerByUser(answerId: string) {
  const user = await getAuthUser()
  if (!user) {
    throw new Error("You must be logged in to unaccept an answer")
  }

  const db = await getEnhancedPrisma()

  // Get the answer with question details
  const answer = await db.answer.findUnique({
    where: { id: answerId },
    include: {
      question: {
        select: {
          id: true,
          slug: true,
          authorId: true,
        }
      }
    }
  })

  if (!answer) {
    throw new Error("Answer not found")
  }

  // Check if the current user is the question owner
  if (answer.question.authorId !== user.id) {
    throw new Error("Only the question owner can unaccept an answer")
  }

  // Unaccept the answer
  const updatedAnswer = await db.answer.update({
    where: { id: answerId },
    data: {
      isAcceptedByUser: false,
      acceptedByUserAt: null,
    }
  })

  revalidatePath(`/questions/${answer.question.id}/${answer.question.slug}`)
  return updatedAnswer
}

export async function acceptAnswerByTeacher(answerId: string) {
  const user = await getAuthUser()
  if (!user) {
    throw new Error("You must be logged in to accept an answer")
  }

  const db = await getEnhancedPrisma()

  // Get the answer with question and course details
  const answer = await db.answer.findUnique({
    where: { id: answerId },
    include: {
      question: {
        select: {
          id: true,
          slug: true,
          courseId: true,
          course: {
            select: {
              authorId: true,
            }
          }
        }
      }
    }
  })

  if (!answer) {
    throw new Error("Answer not found")
  }

  // Check if the question is linked to a course
  if (!answer.question.courseId || !answer.question.course) {
    throw new Error("This question is not linked to a course")
  }

  // Check if the current user is the course teacher
  if (answer.question.course.authorId !== user.id) {
    throw new Error("Only the course teacher can accept an answer")
  }

  // First, unaccept any previously teacher-accepted answer for this question
  await db.answer.updateMany({
    where: {
      questionId: answer.question.id,
      isAcceptedByTeacher: true,
    },
    data: {
      isAcceptedByTeacher: false,
      acceptedByTeacherId: null,
    }
  })

  // Accept the new answer
  const updatedAnswer = await db.answer.update({
    where: { id: answerId },
    data: {
      isAcceptedByTeacher: true,
      acceptedByTeacherId: user.id,
    }
  })

  // Send notification to answer author
  try {
    await notifyAnswerAccepted(answerId, user.id, true)
  } catch (error) {
    console.error('Failed to send teacher answer accepted notification:', error)
    // Don't fail the acceptance if notification fails
  }

  // Check for reputation milestone for answer author
  try {
    await checkReputationMilestone(answer.authorId)
  } catch (error) {
    console.error('Failed to check reputation milestone:', error)
  }

  revalidatePath(`/questions/${answer.question.id}/${answer.question.slug}`)
  return updatedAnswer
}

export async function unacceptAnswerByTeacher(answerId: string) {
  const user = await getAuthUser()
  if (!user) {
    throw new Error("You must be logged in to unaccept an answer")
  }

  const db = await getEnhancedPrisma()

  // Get the answer with question and course details
  const answer = await db.answer.findUnique({
    where: { id: answerId },
    include: {
      question: {
        select: {
          id: true,
          slug: true,
          courseId: true,
          course: {
            select: {
              authorId: true,
            }
          }
        }
      }
    }
  })

  if (!answer) {
    throw new Error("Answer not found")
  }

  // Check if the question is linked to a course
  if (!answer.question.courseId || !answer.question.course) {
    throw new Error("This question is not linked to a course")
  }

  // Check if the current user is the course teacher
  if (answer.question.course.authorId !== user.id) {
    throw new Error("Only the course teacher can unaccept an answer")
  }

  // Unaccept the answer
  const updatedAnswer = await db.answer.update({
    where: { id: answerId },
    data: {
      isAcceptedByTeacher: false,
      acceptedByTeacherId: null,
    }
  })

  revalidatePath(`/questions/${answer.question.id}/${answer.question.slug}`)
  return updatedAnswer
} 