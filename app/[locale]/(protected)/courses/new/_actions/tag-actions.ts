"use server"

import { prisma } from "@/prisma"

export interface CourseTag {
  id: string
  name: string
  description: string | null
  count: number
}

/**
 * Get all available tags with their usage count across courses
 */
export async function getCourseTags(): Promise<CourseTag[]> {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: { select: { courses: true } },
      },
      orderBy: {
        courses: { _count: 'desc' },
      },
    })

    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      description: tag.description,
      count: tag._count.courses,
    }))
  } catch (error) {
    console.error("Error fetching course tags:", error)
    return []
  }
} 
