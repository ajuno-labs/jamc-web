"use server"

import { prisma } from "@/lib/db/prisma"
import { enhance } from "@zenstackhq/runtime"
import { auth } from "@/auth"
import { userWithRolesInclude } from "@/lib/types/prisma"
import { slugify } from "@/lib/utils"
import { QuestionType, Visibility } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { notifyNewCourseQuestion } from "@/lib/services/notification-triggers"

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
    
    // Resolve tags: connect existing & create new to avoid update policy
    // Find tags that already exist
    const existingTags = await prisma.tag.findMany({
      where: { name: { in: data.tags } },
      select: { id: true, name: true }
    })
    const existingNames = existingTags.map(t => t.name)
    // Determine which tags are new
    const newTagNames = data.tags.filter(name => !existingNames.includes(name))
    // If user attempts to create new tags, block and inform them
    if (newTagNames.length > 0) {
      throw new Error(
        `You do not have permission to create new tags: ${newTagNames.join(", ")}. Please use existing tags instead.`
      )
    }
    
    // Use the enhanced client to create the question according to access policies
    const question = await enhancedPrisma.question.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        visibility: data.visibility,
        topic: data.topic,
        slug,
        author: { connect: { id: user.id } },
        // Connect existing tags only
        tags: {
          connect: existingTags.map(t => ({ id: t.id })),
        },
        ...(data.courseId ? { course: { connect: { id: data.courseId } } } : {}),
        ...(data.lessonId ? { lesson: { connect: { id: data.lessonId } } } : {}),
      }
    })
    
    // Send notification if this is a course question
    if (data.courseId) {
      try {
        await notifyNewCourseQuestion(question.id, user.id)
      } catch (error) {
        console.error('Failed to send new course question notification:', error)
        // Don't fail the question creation if notification fails
      }
    }
    
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