"use server"

import { prisma } from "@/prisma"
import { enhance } from "@zenstackhq/runtime"
import { auth } from "@/auth"
import { questionWithRelationsInclude, userWithRolesInclude } from "@/lib/types/prisma"

/**
 * Get questions for the current user
 * 
 * This function uses ZenStack's enhance() directly with user context
 * to enforce access policies for user-specific operations
 */
export async function getUserQuestions() {
  try {
    const session = await auth()

    // If no authenticated user, return empty array
    if (!session?.user?.email) {
      console.log('No authenticated user')
      return { items: [], total: 0 }
    }

    // Get user with roles for proper authorization
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
      include: userWithRolesInclude
    })

    if (!user) {
      console.log('User not found in database')
      return { items: [], total: 0 }
    }

    // Create enhanced client with user context for this specific operation
    // This applies ZenStack's access policies for the current user
    const enhancedPrisma = enhance(prisma, { user }, { logPrismaQuery: true })

    // Use the enhanced client to get questions according to access policies
    const [questions, total] = await Promise.all([
      enhancedPrisma.question.findMany({
        include: questionWithRelationsInclude,
        orderBy: {
          createdAt: "desc"
        }
      }),
      enhancedPrisma.question.count()
    ])

    console.log(`Found ${questions.length} questions for user ${user.email}`)

    return {
      items: questions.map((question) => ({
        id: question.id,
        slug: question.slug,
        title: question.title,
        content: question.content,
        type: question.type,
        author: question.author,
        tags: question.tags,
        answerCount: question._count.answers,
        voteCount: question._count.votes,
        createdAt: question.createdAt.toISOString()
      })),
      total
    }
  } catch (error) {
    console.error("Error fetching user questions:", error)
    return { items: [], total: 0 }
  }
} 
