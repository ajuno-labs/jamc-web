"use server"

import { prisma } from "@/lib/db/prisma"
import { auth } from "@/auth"
import { Prisma } from "@prisma/client"

export type LessonWithCourse = Prisma.LessonGetPayload<{
  include: {
    course: {
      include: {
        enrollments: {
          select: {
            userId: true
          }
        }
        author: {
          select: {
            id: true
          }
        }
        lessons: {
          orderBy: {
            order: 'asc'
          }
          select: {
            id: true
            title: true
            slug: true
            order: true
          }
        }
      }
    }
  }
}>

export type LessonWithNavigation = LessonWithCourse

/**
 * Get a lesson by ID with course info for navigation
 */
export async function getLessonById(id: string): Promise<LessonWithNavigation | null> {
  if (!id) {
    throw new Error("Lesson ID is required")
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            enrollments: {
              select: {
                userId: true
              }
            },
            author: {
              select: {
                id: true
              }
            },
            lessons: {
              orderBy: {
                order: 'asc'
              },
              select: {
                id: true,
                title: true,
                slug: true,
                order: true
              }
            }
          }
        }
      }
    })

    return lesson
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return null
  }
}

/**
 * Get a lesson by slug with course info for access control
 */
export async function getLessonBySlug(courseSlug: string, lessonSlug: string): Promise<LessonWithCourse | null> {
  if (!courseSlug || !lessonSlug) {
    throw new Error("Course slug and lesson slug are required")
  }

  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        slug: lessonSlug,
        course: {
          slug: courseSlug
        }
      },
      include: {
        course: {
          include: {
            enrollments: {
              select: {
                userId: true
              }
            },
            author: {
              select: {
                id: true
              }
            },
            lessons: {
              orderBy: {
                order: 'asc'
              },
              select: {
                id: true,
                title: true,
                slug: true,
                order: true
              }
            }
          }
        }
      }
    })

    return lesson
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return null
  }
}

/**
 * Check if a user can access a lesson
 */
export async function canAccessLesson(lesson: LessonWithCourse): Promise<boolean> {
  const session = await auth()
  if (!session?.user?.id) return false

  const userId = session.user.id
  
  // Author can always access
  if (lesson.course.author.id === userId) return true
  
  // Check if user is enrolled
  return lesson.course.enrollments.some(e => e.userId === userId)
}

/**
 * Get lesson by ID and redirect to the correct URL if needed
 */
export async function getLessonAndRedirect(lessonId: string): Promise<{
  courseSlug: string
  lessonSlug: string
} | null> {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        slug: true,
        course: {
          select: {
            slug: true
          }
        }
      }
    })

    if (!lesson) return null

    return {
      courseSlug: lesson.course.slug,
      lessonSlug: lesson.slug
    }
  } catch (error) {
    console.error("Error fetching lesson for redirect:", error)
    return null
  }
} 