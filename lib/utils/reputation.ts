import { prisma } from "@/lib/db/prisma"

export async function calculateUserReputation(userId: string): Promise<number> {
  const [questionVotes, answerVotes] = await Promise.all([
    prisma.questionVote.aggregate({
      where: {
        question: {
          authorId: userId
        }
      },
      _sum: {
        value: true
      }
    }),
    prisma.answerVote.aggregate({
      where: {
        answer: {
          authorId: userId
        }
      },
      _sum: {
        value: true
      }
    })
  ])

  return (questionVotes._sum.value || 0) + (answerVotes._sum.value || 0)
} 