"use server"

import { prisma } from "@/lib/db/prisma"
import { CourseCardProps, courseWithRelationsInclude, transformCourseToCardProps } from "@/lib/types/course"

/**
 * Get all courses with filtering options
 */
export async function getCourses(options?: {
  searchTerm?: string
  topic?: string
  teacherId?: string
}): Promise<CourseCardProps[]> {
  try {
    const { searchTerm, topic, teacherId } = options || {}
    
    // Build the where clause based on filter options
    const where: any = {}
    
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }
    
    if (topic) {
      where.tags = {
        some: {
          name: topic
        }
      }
    }
    
    if (teacherId) {
      where.authorId = teacherId
    }
    
    // Fetch courses with related data
    const courses = await prisma.course.findMany({
      where,
      include: courseWithRelationsInclude,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Transform the data for the frontend
    return courses.map(transformCourseToCardProps)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return []
  }
}

/**
 * Get a single course by ID
 */
export async function getCourseById(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: courseWithRelationsInclude
    })
    
    return course
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  }
}

/**
 * Get unique topics (tags) used in courses
 */
export type TopicWithCount = {
  name: string
  count: number
}

export async function getTopics(): Promise<TopicWithCount[]> {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        courses: {
          some: {}
        }
      },
      select: {
        name: true,
        _count: {
          select: {
            courses: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return tags.map(tag => ({
      name: tag.name,
      count: tag._count.courses
    }))
  } catch (error) {
    console.error("Error fetching topics:", error)
    return []
  }
}

/**
 * Get teachers who have created courses
 */
export type TeacherWithCount = {
  id: string
  name: string
  image: string | null
  courseCount: number
}

export async function getTeachers(): Promise<TeacherWithCount[]> {
  try {
    const teachers = await prisma.user.findMany({
      where: {
        createdCourses: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        _count: {
          select: {
            createdCourses: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return teachers.map(teacher => ({
      id: teacher.id,
      name: teacher.name || 'Unknown',
      image: teacher.image,
      courseCount: teacher._count.createdCourses
    }))
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return []
  }
} 