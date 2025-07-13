"use server"

import { getAuthUser } from "@/lib/auth"
import { getEnhancedPrisma } from "@/lib/db/enhanced"
import { prisma } from "@/lib/db/prisma"
import { notifyWelcome } from "@/lib/services/notification-triggers"
import { redirect } from "@/i18n/navigation"

export async function assignUserRole(role: "teacher" | "student") {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      return {
        success: false,
        error: "User not authenticated"
      }
    }

    const db = prisma
    
    // Map role to database role names
    const roleName = role === "teacher" ? "TEACHER" : "STUDENT"
    
    // Find the role in the database
    const roleRecord = await db.role.findFirst({
      where: { name: roleName }
    })
    
    if (!roleRecord) {
      return {
        success: false,
        error: "Role not found"
      }
    }
    
    // Assign role to user
    await db.user.update({
      where: { id: user.id },
      data: {
        roles: {
          connect: { id: roleRecord.id }
        }
      }
    })
    
    // Create default notification preferences for the user
    try {
      await db.notificationPreferences.upsert({
        where: { userId: user.id },
        update: {}, // Don't update existing preferences
        create: {
          userId: user.id,
          newAnswer: ['IN_APP', 'EMAIL'],
          answerAccepted: ['IN_APP', 'EMAIL'],
          questionComment: ['IN_APP', 'EMAIL'],
          answerComment: ['IN_APP', 'EMAIL'],
          questionVote: ['IN_APP'],
          answerVote: ['IN_APP'],
          newCourseQuestion: ['IN_APP', 'EMAIL'],
          newLesson: ['IN_APP', 'EMAIL'],
          courseUpdate: ['IN_APP', 'EMAIL'],
          followedUserActivity: ['IN_APP'],
          followedQuestionActivity: ['IN_APP'],
          studentEngagement: ['IN_APP', 'EMAIL'],
          systemNotifications: ['IN_APP', 'EMAIL'],
          emailDigestFrequency: 'WEEKLY',
          timezone: 'UTC'
        }
      })
    } catch (preferencesError) {
      console.warn("Failed to create notification preferences (non-critical):", preferencesError)
      // Don't fail the entire onboarding if notification preferences fail
    }
    
    return {
      success: true,
      role: roleName
    }
  } catch (error) {
    console.error("Error assigning user role:", error)
    return {
      success: false,
      error: "Failed to assign role"
    }
  }
}

export async function joinCourseWithCode(joinCode: string) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      return {
        success: false,
        error: "User not authenticated"
      }
    }

    const db = await getEnhancedPrisma()
    
    // Find course by join code
    const course = await db.course.findUnique({
      where: { joinCode: joinCode.toUpperCase() },
      select: { id: true, slug: true, title: true }
    })
    
    if (!course) {
      return {
        success: false,
        error: "Invalid course code. Please check the code and try again."
      }
    }
    
    // Check if user is already enrolled
    const existingEnrollment = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id
        }
      }
    })
    
    if (existingEnrollment) {
      return {
        success: false,
        error: "You are already enrolled in this course"
      }
    }
    
    // Create enrollment
    await db.courseEnrollment.create({
      data: {
        userId: user.id,
        courseId: course.id
      }
    })
    
    return {
      success: true,
      courseSlug: course.slug,
      courseTitle: course.title
    }
  } catch (error) {
    console.error("Error joining course:", error)
    return {
      success: false,
      error: "Failed to join course. Please try again."
    }
  }
}

export async function triggerWelcomeNotification() {
  const user = await getAuthUser()
  if (!user) {
    return redirect("/signin")
  }

  try {
    await notifyWelcome(user.id)
    return { success: true }
  } catch (error) {
    console.error("Failed to send welcome notification:", error)
    return { success: false, error: "Failed to send welcome notification" }
  }
} 
