"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"

/**
 * Enroll a user in a course
 */
export async function enrollInCourse(courseId: string) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to enroll in a course"
      }
    }
    
    const userId = session.user.id
    
    // Check if the user is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId
      }
    })
    
    if (existingEnrollment) {
      return {
        success: false,
        message: "You are already enrolled in this course"
      }
    }
    
    // Create the enrollment
    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: "ACTIVE",
        enrolledAt: new Date()
      }
    })
    
    // Revalidate the course page
    revalidatePath(`/courses/[slug]`)
    
    return {
      success: true,
      message: "Successfully enrolled in the course"
    }
  } catch (error) {
    console.error("Error enrolling in course:", error)
    return {
      success: false,
      message: "Failed to enroll in the course"
    }
  }
}

/**
 * Unenroll a user from a course
 */
export async function unenrollFromCourse(courseId: string) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to unenroll from a course"
      }
    }
    
    const userId = session.user.id
    
    // Check if the user is enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId
      }
    })
    
    if (!existingEnrollment) {
      return {
        success: false,
        message: "You are not enrolled in this course"
      }
    }
    
    // Delete the enrollment
    await prisma.enrollment.delete({
      where: {
        id: existingEnrollment.id
      }
    })
    
    // Revalidate the course page
    revalidatePath(`/courses/[slug]`)
    
    return {
      success: true,
      message: "Successfully unenrolled from the course"
    }
  } catch (error) {
    console.error("Error unenrolling from course:", error)
    return {
      success: false,
      message: "Failed to unenroll from the course"
    }
  }
}

/**
 * Check if a user is enrolled in a course
 */
export async function checkEnrollmentStatus(courseId: string) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        isEnrolled: false
      }
    }
    
    const userId = session.user.id
    
    // Check if the user is enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId
      }
    })
    
    return {
      isEnrolled: !!existingEnrollment,
      status: existingEnrollment?.status || null,
      enrolledAt: existingEnrollment?.enrolledAt || null
    }
  } catch (error) {
    console.error("Error checking enrollment status:", error)
    return {
      isEnrolled: false,
      error: "Failed to check enrollment status"
    }
  }
}

/**
 * Mark a module as completed
 */
export async function markModuleAsCompleted(moduleId: string) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to track progress"
      }
    }
    
    const userId = session.user.id
    
    // Get the course ID for this module
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { courseId: true }
    })
    
    if (!module) {
      return {
        success: false,
        message: "Module not found"
      }
    }
    
    // Check if the user is enrolled in the course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: module.courseId
      }
    })
    
    if (!enrollment) {
      return {
        success: false,
        message: "You must be enrolled in this course to track progress"
      }
    }
    
    // Check if the module is already completed
    const existingProgress = await prisma.moduleProgress.findFirst({
      where: {
        userId,
        moduleId
      }
    })
    
    if (existingProgress) {
      return {
        success: true,
        message: "Module already marked as completed",
        alreadyCompleted: true
      }
    }
    
    // Create the progress record
    await prisma.moduleProgress.create({
      data: {
        userId,
        moduleId,
        completedAt: new Date()
      }
    })
    
    // Revalidate the module page
    revalidatePath(`/courses/[slug]/modules/[moduleId]`)
    
    return {
      success: true,
      message: "Module marked as completed"
    }
  } catch (error) {
    console.error("Error marking module as completed:", error)
    return {
      success: false,
      message: "Failed to mark module as completed"
    }
  }
} 