"use server"

import { getEnhancedPrisma } from "@/lib/db/enhanced"
import { ModuleWithRelations, moduleWithRelationsInclude } from "@/lib/types/course"

/**
 * Get a module by ID and course ID
 */
export async function getModuleById(moduleId: string, courseId: string): Promise<ModuleWithRelations | null> {
  try {
    const db = await getEnhancedPrisma()
    const moduleData = await db.courseModule.findFirst({
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
    const db = await getEnhancedPrisma()
    const modules = await db.courseModule.findMany({
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