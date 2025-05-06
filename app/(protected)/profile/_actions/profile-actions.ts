"use server"

import { prisma } from "@/lib/db/prisma"
import { auth } from "@/auth"
import { getAuthUser } from "@/lib/auth/get-user"
import { questionWithRelationsInclude } from "@/lib/types/prisma"

/**
 * Get current user's profile data
 */
export async function getUserProfile() {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      return null
    }
    
    // Get user's questions
    const questions = await prisma.question.findMany({
      where: {
        authorId: user.id
      },
      include: questionWithRelationsInclude,
      orderBy: {
        createdAt: "desc"
      },
      take: 5 // Limit to most recent 5 questions
    })
    
    // Get user's answers
    const answers = await prisma.answer.findMany({
      where: {
        authorId: user.id
      },
      include: {
        question: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5 // Limit to most recent 5 answers
    })
    
    // Count total questions and answers
    const [totalQuestions, totalAnswers] = await Promise.all([
      prisma.question.count({
        where: { authorId: user.id }
      }),
      prisma.answer.count({
        where: { authorId: user.id }
      })
    ])
    
    // Calculate reputation as sum of all question and answer votes
    const questionVotes = await prisma.questionVote.aggregate({
      where: {
        question: {
          authorId: user.id
        }
      },
      _sum: {
        value: true
      }
    })
    
    const answerVotes = await prisma.answerVote.aggregate({
      where: {
        answer: {
          authorId: user.id
        }
      },
      _sum: {
        value: true
      }
    })
    
    const reputation = (questionVotes._sum.value || 0) + (answerVotes._sum.value || 0)
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        roles: user.roles.map(role => ({
          name: role.name,
          permissions: role.permissions.map(p => p.name)
        }))
      },
      questions: questions.map(q => ({
        id: q.id,
        slug: q.slug,
        title: q.title,
        type: q.type,
        createdAt: q.createdAt.toISOString(),
        answerCount: q._count.answers,
        voteCount: q._count.votes
      })),
      answers: answers.map(a => ({
        id: a.id,
        content: a.content.substring(0, 100) + (a.content.length > 100 ? '...' : ''),
        questionId: a.questionId,
        questionTitle: a.question.title,
        questionSlug: a.question.slug,
        createdAt: a.createdAt.toISOString(),
        isAccepted: a.isAccepted
      })),
      stats: {
        totalQuestions,
        totalAnswers,
        reputation
      }
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
} 