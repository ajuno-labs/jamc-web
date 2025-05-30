import { prisma } from "@/lib/db/prisma"

// Reputation calculation constants
const REPUTATION_WEIGHTS = {
  QUESTION_UPVOTE: 2,       // Points per upvote on user's questions
  QUESTION_DOWNVOTE: -1,    // Points per downvote on user's questions
  ANSWER_UPVOTE: 3,         // Points per upvote on user's answers (higher weight)
  ANSWER_DOWNVOTE: -1,      // Points per downvote on user's answers
  ACCEPTED_ANSWER_BONUS: 10, // Bonus points for having answer accepted
  QUESTION_POSTED: 1,       // Base points for posting a question
  ANSWER_POSTED: 2,         // Base points for posting an answer
} as const

export interface ReputationBreakdown {
  questionVotes: number
  answerVotes: number
  acceptedAnswers: number
  questionsPosted: number
  answersPosted: number
  total: number
  breakdown: {
    fromQuestionVotes: number
    fromAnswerVotes: number
    fromAcceptedAnswers: number
    fromQuestionsPosted: number
    fromAnswersPosted: number
  }
}

export async function calculateUserReputation(userId: string): Promise<number> {
  const breakdown = await calculateUserReputationWithBreakdown(userId)
  return breakdown.total
}

export async function calculateUserReputationWithBreakdown(userId: string): Promise<ReputationBreakdown> {
  try {
    // Get question votes
    const questionVotesResult = await prisma.questionVote.aggregate({
      where: {
        question: {
          authorId: userId
        }
      },
      _sum: {
        value: true
      }
    })

    // Get answer votes
    const answerVotesResult = await prisma.answerVote.aggregate({
      where: {
        answer: {
          authorId: userId
        }
      },
      _sum: {
        value: true
      }
    })

    // Count accepted answers (both by user and by teacher)
    const acceptedAnswersCount = await prisma.answer.count({
      where: {
        authorId: userId,
        OR: [
          { isAcceptedByUser: true },
          { isAcceptedByTeacher: true }
        ]
      }
    })

    // Count total questions and answers posted
    const [questionsCount, answersCount] = await Promise.all([
      prisma.question.count({
        where: { authorId: userId }
      }),
      prisma.answer.count({
        where: { authorId: userId }
      })
    ])

    // Separate upvotes and downvotes for questions
    const questionUpvotes = await prisma.questionVote.count({
      where: {
        question: { authorId: userId },
        value: 1
      }
    })

    const questionDownvotes = await prisma.questionVote.count({
      where: {
        question: { authorId: userId },
        value: -1
      }
    })

    // Separate upvotes and downvotes for answers
    const answerUpvotes = await prisma.answerVote.count({
      where: {
        answer: { authorId: userId },
        value: 1
      }
    })

    const answerDownvotes = await prisma.answerVote.count({
      where: {
        answer: { authorId: userId },
        value: -1
      }
    })

    // Calculate reputation components
    const fromQuestionVotes = 
      (questionUpvotes * REPUTATION_WEIGHTS.QUESTION_UPVOTE) + 
      (questionDownvotes * REPUTATION_WEIGHTS.QUESTION_DOWNVOTE)

    const fromAnswerVotes = 
      (answerUpvotes * REPUTATION_WEIGHTS.ANSWER_UPVOTE) + 
      (answerDownvotes * REPUTATION_WEIGHTS.ANSWER_DOWNVOTE)

    const fromAcceptedAnswers = acceptedAnswersCount * REPUTATION_WEIGHTS.ACCEPTED_ANSWER_BONUS

    const fromQuestionsPosted = questionsCount * REPUTATION_WEIGHTS.QUESTION_POSTED

    const fromAnswersPosted = answersCount * REPUTATION_WEIGHTS.ANSWER_POSTED

    const total = Math.max(0, // Ensure reputation never goes below 0
      fromQuestionVotes + 
      fromAnswerVotes + 
      fromAcceptedAnswers + 
      fromQuestionsPosted + 
      fromAnswersPosted
    )

    return {
      questionVotes: questionVotesResult._sum.value || 0,
      answerVotes: answerVotesResult._sum.value || 0,
      acceptedAnswers: acceptedAnswersCount,
      questionsPosted: questionsCount,
      answersPosted: answersCount,
      total,
      breakdown: {
        fromQuestionVotes,
        fromAnswerVotes,
        fromAcceptedAnswers,
        fromQuestionsPosted,
        fromAnswersPosted
      }
    }
  } catch (error) {
    console.error("Error calculating user reputation:", error)
    return {
      questionVotes: 0,
      answerVotes: 0,
      acceptedAnswers: 0,
      questionsPosted: 0,
      answersPosted: 0,
      total: 0,
      breakdown: {
        fromQuestionVotes: 0,
        fromAnswerVotes: 0,
        fromAcceptedAnswers: 0,
        fromQuestionsPosted: 0,
        fromAnswersPosted: 0
      }
    }
  }
} 