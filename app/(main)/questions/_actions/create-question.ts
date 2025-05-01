"use server"

import { prisma } from "@/lib/db/prisma"
import { enhance } from "@zenstackhq/runtime"
import { auth } from "@/auth"
import { userWithRolesInclude } from "@/lib/types/prisma"
import { slugify } from "@/lib/utils"
import { QuestionType, Visibility } from "@prisma/client"
import { revalidatePath } from "next/cache"

interface CreateQuestionParams {
  title: string
  content: string
  type: QuestionType
  visibility: Visibility
  topic?: string
  tags: string[]
  courseId?: string
  lessonId?: string
}

/**
 * Create a new question
 * 
 * This function uses ZenStack's enhance() directly with user context
 * to enforce access policies for creation operations
 */
export async function createQuestion(data: CreateQuestionParams) {
  try {
    const session = await auth()
    
    // Must be authenticated to create a question
    if (!session?.user?.email) {
      throw new Error("You must be signed in to create a question")
    }
    
    // Get user with roles for proper authorization
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
      include: userWithRolesInclude
    })
    
    if (!user) {
      throw new Error("User not found")
    }
    
    // Create enhanced client with user context for this specific operation
    // This applies ZenStack's access policies for the current user
    const enhancedPrisma = enhance(prisma, { user })
    
    // Generate slug from title
    const slug = slugify(data.title)
    
    // Connect or create tags
    const tagConnections = data.tags.map(tagName => ({
      where: { name: tagName },
      create: { name: tagName }
    }))
    
    // Use the enhanced client to create the question according to access policies
    const question = await enhancedPrisma.question.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        visibility: data.visibility,
        topic: data.topic,
        slug,
        author: {
          connect: { id: user.id }
        },
        tags: {
          connectOrCreate: tagConnections
        },
        ...(data.courseId ? { course: { connect: { id: data.courseId } } } : {}),
        ...(data.lessonId ? { lesson: { connect: { id: data.lessonId } } } : {}),
      }
    })
    
    // Revalidate the questions page
    revalidatePath('/questions')
    
    return { success: true, questionId: question.id, slug: question.slug }
  } catch (error) {
    console.error("Error creating question:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    }
  }
} 