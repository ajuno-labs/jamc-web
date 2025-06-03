"use server"

import { getAuthUser } from "@/lib/auth/get-user"
import { getEnhancedPrisma } from "@/lib/db/enhanced"
import { prisma } from "@/lib/db/prisma"

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