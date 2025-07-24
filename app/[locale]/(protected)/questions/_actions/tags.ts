"use server"

import { prisma } from "@/prisma"

/**
 * Get all available tags with their usage count
 * Returns tags sorted by usage count (most used first)
 */
export async function getTags() {
  try {
    // Get all tags with question count
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            questions: true
          }
        }
      },
      orderBy: {
        questions: {
          _count: 'desc'
        }
      }
    })

    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      description: tag.description,
      count: tag._count.questions
    }))
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
} 
