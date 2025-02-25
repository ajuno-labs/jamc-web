"use server"

import { prisma } from "@/lib/db/prisma"
import { enhance } from "@zenstackhq/runtime"
import { QuestionType, Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { questionWithRelationsInclude } from "@/lib/types/prisma"

interface SearchQuestionsResult {
  items: Array<{
    id: string
    slug: string
    title: string
    content: string
    type: QuestionType
    author: {
      name: string | null
      image: string | null
    }
    tags: Array<{ name: string }>
    answerCount: number
    voteCount: number
    createdAt: string
  }>
  total: number
  hasMore: boolean
}

/**
 * Search for questions with pagination
 * 
 * This function uses the original Prisma client for public questions
 * and handles its own access control with the visibility filter
 */
export async function searchQuestions(
  query: string = "",
  type: "all" | QuestionType = "all",
  page: number = 1,
  pageSize: number = 10
): Promise<SearchQuestionsResult> {
  try {
    // For public question listing, we use the original prisma client
    // with explicit filtering rather than relying on ZenStack's policies
    const db = prisma
    const skip = (page - 1) * pageSize
    const session = await auth()

    // Debug logging
    console.log('Current session:', {
      user: session?.user,
      email: session?.user?.email
    })

    // Build the where clause
    const where: Prisma.QuestionWhereInput = {
      AND: [
        // Only apply search conditions if query is not empty
        query ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
            { content: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
            {
              tags: {
                some: {
                  name: { contains: query, mode: "insensitive" as Prisma.QueryMode }
                }
              }
            }
          ]
        } : {},
        // Always apply type filter if not "all"
        type === "all" ? {} : { type },
        // Only show public questions to maintain some access control
        { visibility: "PUBLIC" }
      ]
    }

    // Get total count for pagination
    const total = await db.question.count({ where })

    // Get paginated questions
    const questions = await db.question.findMany({
      where,
      include: questionWithRelationsInclude,
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: pageSize
    })

    // Debug logging
    console.log('Found questions:', questions.length)
    console.log('Total questions:', total)

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
      total,
      hasMore: skip + questions.length < total
    }
  } catch (error) {
    console.error("Search error:", error)
    return { items: [], total: 0, hasMore: false }
  }
} 