"use server"

import { prisma } from "@/lib/db/prisma"
import { ModuleWithRelations, moduleWithRelationsInclude } from "@/lib/types/course"

/**
 * Get a module by ID and course ID
 */
export async function getModuleById(moduleId: string, courseId: string): Promise<ModuleWithRelations | null> {
  try {
    const moduleData = await prisma.module.findFirst({
      where: { 
        id: moduleId,
        course: {
          id: courseId
        }
      },
      include: moduleWithRelationsInclude
    })
    
    return moduleData
  } catch (error) {
    console.error("Error fetching module:", error)
    return null
  }
}

/**
 * Get all modules for a course
 */
export async function getModulesByCourseId(courseId: string) {
  try {
    const modules = await prisma.module.findMany({
      where: {
        courseId
      },
      orderBy: {
        order: 'asc'
      }
    })
    
    return modules
  } catch (error) {
    console.error("Error fetching modules:", error)
    return []
  }
}

/**
 * Mark a module as completed for the current user
 */
export async function markModuleAsCompleted(moduleId: string, userId: string) {
  try {
    // Check if the module progress already exists
    const existingProgress = await prisma.moduleProgress.findFirst({
      where: {
        moduleId,
        userId
      }
    })
    
    if (existingProgress) {
      return {
        success: true,
        message: "Module already marked as completed"
      }
    }
    
    // Create new progress record
    await prisma.moduleProgress.create({
      data: {
        moduleId,
        userId,
        completedAt: new Date()
      }
    })
    
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

/**
 * Check if a module is completed by the user
 */
export async function isModuleCompleted(moduleId: string, userId: string) {
  try {
    const progress = await prisma.moduleProgress.findFirst({
      where: {
        moduleId,
        userId
      }
    })
    
    return !!progress
  } catch (error) {
    console.error("Error checking module completion:", error)
    return false
  }
} 