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
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
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
    await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId
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
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
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
    await prisma.courseEnrollment.delete({
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
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId,
        courseId
      }
    })
    
    return {
      isEnrolled: !!existingEnrollment,
      enrolledAt: existingEnrollment?.createdAt || null
    }
  } catch (error) {
    console.error("Error checking enrollment status:", error)
    return {
      isEnrolled: false,
      error: "Failed to check enrollment status"
    }
  }
} 