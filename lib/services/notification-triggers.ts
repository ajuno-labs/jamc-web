"use server"

import { createNotification, createNotifications } from "./notification-service"
import { getEnhancedPrisma } from "@/lib/db/enhanced"
import type { NotificationCreateRequest, NotificationMetadata } from "@/lib/types/notification"

async function getQuestionForNotification(questionId: string) {
  const db = await getEnhancedPrisma()
  
  return await db.question.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      title: true,
      authorId: true,
      courseId: true,
      course: {
        select: {
          id: true,
          title: true,
          authorId: true,
          enrollments: {
            select: {
              userId: true
            }
          }
        }
      }
    }
  })
}

async function getAnswerForNotification(answerId: string) {
  const db = await getEnhancedPrisma()
  
  return await db.answer.findUnique({
    where: { id: answerId },
    select: {
      id: true,
      authorId: true,
      question: {
        select: {
          id: true,
          title: true,
          authorId: true,
          courseId: true,
          course: {
            select: {
              id: true,
              title: true,
              authorId: true
            }
          }
        }
      }
    }
  })
}

// Helper to get user details for notifications
async function getUserForNotification(userId: string) {
  const db = await getEnhancedPrisma()
  
  return await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true
    }
  })
}

// 1. NEW ANSWER notification
export async function notifyNewAnswer(answerId: string, actorId: string) {
  try {
    const answer = await getAnswerForNotification(answerId)
    if (!answer) return

    const actor = await getUserForNotification(actorId)
    if (!actor) return

    // Don't notify if the question author is answering their own question
    if (answer.question.authorId === actorId) return

    const metadata: NotificationMetadata = {
      questionId: answer.question.id,
      questionTitle: answer.question.title,
      answerId: answer.id,
      userName: actor.name || 'Anonymous',
      userImage: actor.image || undefined
    }

    await createNotification({
      type: 'NEW_ANSWER',
      userId: answer.question.authorId,
      actorId: actorId,
      metadata
    })

    // Also notify subscribers to this question
    await notifyQuestionSubscribers(answer.question.id, 'FOLLOWED_QUESTION_ANSWER', actorId, metadata)

  } catch (error) {
    console.error('Failed to send new answer notification:', error)
  }
}

// 2. ANSWER ACCEPTED notifications
export async function notifyAnswerAccepted(answerId: string, acceptedByUserId: string, acceptedByTeacher: boolean = false) {
  try {
    const answer = await getAnswerForNotification(answerId)
    if (!answer) return

    const acceptor = await getUserForNotification(acceptedByUserId)
    if (!acceptor) return

    // Don't notify if user is accepting their own answer
    if (answer.authorId === acceptedByUserId) return

    const metadata: NotificationMetadata = {
      questionId: answer.question.id,
      questionTitle: answer.question.title,
      answerId: answer.id,
      userName: acceptor.name || 'Anonymous',
      userImage: acceptor.image || undefined
    }

    await createNotification({
      type: acceptedByTeacher ? 'ANSWER_ACCEPTED_TEACHER' : 'ANSWER_ACCEPTED_USER',
      userId: answer.authorId,
      actorId: acceptedByUserId,
      metadata
    })

  } catch (error) {
    console.error('Failed to send answer accepted notification:', error)
  }
}

// 3. COMMENT notifications
export async function notifyComment(commentId: string, actorId: string, questionId?: string, answerId?: string) {
  try {
    const actor = await getUserForNotification(actorId)
    if (!actor) return

    let targetUserId: string | undefined
    let metadata: NotificationMetadata

    if (questionId) {
      const question = await getQuestionForNotification(questionId)
      if (!question || question.authorId === actorId) return // Don't notify self

      targetUserId = question.authorId
      metadata = {
        questionId: question.id,
        questionTitle: question.title,
        commentId,
        userName: actor.name || 'Anonymous',
        userImage: actor.image || undefined
      }

      await createNotification({
        type: 'QUESTION_COMMENT',
        userId: targetUserId,
        actorId: actorId,
        metadata
      })

    } else if (answerId) {
      const answer = await getAnswerForNotification(answerId)
      if (!answer || answer.authorId === actorId) return // Don't notify self

      targetUserId = answer.authorId
      metadata = {
        questionId: answer.question.id,
        questionTitle: answer.question.title,
        answerId: answer.id,
        commentId,
        userName: actor.name || 'Anonymous',
        userImage: actor.image || undefined
      }

      await createNotification({
        type: 'ANSWER_COMMENT',
        userId: targetUserId,
        actorId: actorId,
        metadata
      })
    }

  } catch (error) {
    console.error('Failed to send comment notification:', error)
  }
}

// 4. VOTE notifications
export async function notifyVote(
  entityType: 'question' | 'answer',
  entityId: string,
  voteValue: 1 | -1,
  actorId: string
) {
  try {
    const actor = await getUserForNotification(actorId)
    if (!actor) return

    let targetUserId: string | undefined
    let questionTitle: string | undefined
    let notificationType: 'QUESTION_UPVOTE' | 'QUESTION_DOWNVOTE' | 'ANSWER_UPVOTE' | 'ANSWER_DOWNVOTE'

    if (entityType === 'question') {
      const question = await getQuestionForNotification(entityId)
      if (!question || question.authorId === actorId) return // Don't notify self

      targetUserId = question.authorId
      questionTitle = question.title
      notificationType = voteValue === 1 ? 'QUESTION_UPVOTE' : 'QUESTION_DOWNVOTE'
    } else {
      const answer = await getAnswerForNotification(entityId)
      if (!answer || answer.authorId === actorId) return // Don't notify self

      targetUserId = answer.authorId
      questionTitle = answer.question.title
      notificationType = voteValue === 1 ? 'ANSWER_UPVOTE' : 'ANSWER_DOWNVOTE'
    }

    const metadata: NotificationMetadata = {
      questionId: entityType === 'question' ? entityId : undefined,
      answerId: entityType === 'answer' ? entityId : undefined,
      questionTitle,
      voteValue,
      userName: actor.name || 'Anonymous',
      userImage: actor.image || undefined
    }

    await createNotification({
      type: notificationType,
      userId: targetUserId!,
      actorId: actorId,
      metadata
    })

  } catch (error) {
    console.error('Failed to send vote notification:', error)
  }
}

// 5. NEW COURSE QUESTION notification
export async function notifyNewCourseQuestion(questionId: string, actorId: string) {
  try {
    const question = await getQuestionForNotification(questionId)
    if (!question?.courseId || !question.course) return

    const actor = await getUserForNotification(actorId)
    if (!actor) return

    // Don't notify the course teacher if they asked the question
    if (question.course.authorId === actorId) return

    const metadata: NotificationMetadata = {
      questionId: question.id,
      questionTitle: question.title,
      courseId: question.course.id,
      courseTitle: question.course.title,
      userName: actor.name || 'Anonymous',
      userImage: actor.image || undefined
    }

    // Notify the course teacher
    await createNotification({
      type: 'NEW_COURSE_QUESTION',
      userId: question.course.authorId,
      actorId: actorId,
      metadata
    })

    // Optionally notify subscribed students (if they have subscriptions enabled)
    // This could be implemented based on notification preferences
    
  } catch (error) {
    console.error('Failed to send new course question notification:', error)
  }
}

// 6. NEW LESSON notification
export async function notifyNewLesson(lessonId: string, courseId: string, actorId: string) {
  try {
    const db = await getEnhancedPrisma()
    
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        course: {
          select: {
            id: true,
            title: true,
            authorId: true,
            enrollments: {
              select: {
                userId: true,
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!lesson) return

    const actor = await getUserForNotification(actorId)
    if (!actor) return

    const metadata: NotificationMetadata = {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      courseId: lesson.course.id,
      courseTitle: lesson.course.title,
      userName: actor.name || 'Anonymous',
      userImage: actor.image || undefined
    }

    // Create notifications for all enrolled students
    const notifications: NotificationCreateRequest[] = lesson.course.enrollments
      .filter(enrollment => enrollment.userId !== actorId) // Don't notify the creator
      .map(enrollment => ({
        type: 'NEW_LESSON' as const,
        userId: enrollment.userId,
        actorId: actorId,
        metadata
      }))

    if (notifications.length > 0) {
      await createNotifications(notifications)
    }

  } catch (error) {
    console.error('Failed to send new lesson notifications:', error)
  }
}

export async function notifyWelcome(userId: string) {
  try {
    const user = await getUserForNotification(userId)
    if (!user) return

    const metadata: NotificationMetadata = {
      userName: user.name || 'there'
    }

    await createNotification({
      type: 'WELCOME',
      userId: userId,
      metadata
    })

  } catch (error) {
    console.error('Failed to send welcome notification:', error)
  }
}

// 8. REPUTATION MILESTONE notification
// TOOD: Update reputation system later on, will soone be removed
export async function notifyReputationMilestone(userId: string, newReputation: number, change: number) {
  try {
    // Define milestone thresholds
    const milestones = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
    
    // Check if this reputation change crosses a milestone
    const oldReputation = newReputation - change
    const crossedMilestone = milestones.find(milestone => 
      oldReputation < milestone && newReputation >= milestone
    )

    if (!crossedMilestone) return

    const user = await getUserForNotification(userId)
    if (!user) return

    const metadata: NotificationMetadata = {
      userName: user.name || 'User',
      newReputationTotal: newReputation,
      reputationChange: change
    }

    await createNotification({
      type: 'REPUTATION_MILESTONE',
      userId: userId,
      metadata
    })

  } catch (error) {
    console.error('Failed to send reputation milestone notification:', error)
  }
}

async function notifyQuestionSubscribers(
  questionId: string, 
  notificationType: 'FOLLOWED_QUESTION_ANSWER',
  actorId: string,
  baseMetadata: NotificationMetadata
) {
  try {
    const db = await getEnhancedPrisma()
    
    const subscriptions = await db.notificationSubscription.findMany({
      where: {
        subscriptionType: 'QUESTION',
        entityId: questionId,
        userId: { not: actorId } // Don't notify the actor
      },
      select: {
        userId: true
      }
    })

    if (subscriptions.length === 0) return

    const notifications: NotificationCreateRequest[] = subscriptions.map(sub => ({
      type: notificationType,
      userId: sub.userId,
      actorId: actorId,
      metadata: baseMetadata
    }))

    await createNotifications(notifications)

  } catch (error) {
    console.error('Failed to notify question subscribers:', error)
  }
}

// Function to subscribe to a question
export async function subscribeToQuestion(questionId: string, userId: string) {
  try {
    const db = await getEnhancedPrisma()
    
    await db.notificationSubscription.upsert({
      where: {
        userId_subscriptionType_entityId: {
          userId,
          subscriptionType: 'QUESTION',
          entityId: questionId
        }
      },
      create: {
        userId,
        subscriptionType: 'QUESTION',
        entityId: questionId,
        channels: ['IN_APP', 'EMAIL']
      },
      update: {
        channels: ['IN_APP', 'EMAIL']
      }
    })

  } catch (error) {
    console.error('Failed to subscribe to question:', error)
    throw error
  }
}

// Function to unsubscribe from a question
export async function unsubscribeFromQuestion(questionId: string, userId: string) {
  try {
    const db = await getEnhancedPrisma()
    
    await db.notificationSubscription.delete({
      where: {
        userId_subscriptionType_entityId: {
          userId,
          subscriptionType: 'QUESTION',
          entityId: questionId
        }
      }
    })

  } catch (error) {
    console.error('Failed to unsubscribe from question:', error)
    throw error
  }
} 
