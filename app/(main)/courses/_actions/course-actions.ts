"use server"

import { prisma } from "@/lib/db/prisma"
import { CourseCardProps, courseWithRelationsInclude, transformCourseToCardProps } from "@/lib/types/course"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

export type CourseWithStructure = Prisma.CourseGetPayload<{
  include: {
    volumes: {
      include: {
        chapters: {
          include: {
            modules: {
              include: {
                lessons: true
              }
            }
          }
        }
      }
    }
  }
}>

export type CourseWithBasicRelations = Prisma.CourseGetPayload<{
  include: {
    author: {
      select: {
        id: true
        name: true
        image: true
      }
    }
    tags: {
      select: {
        id: true
        name: true
      }
    }
    volumes: {
      include: {
        _count: {
          select: {
            chapters: true
          }
        }
      }
    }
    enrollments: {
      select: {
        userId: true
      }
    }
  }
}>

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
    const where: Prisma.CourseWhereInput = {}
    
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
export async function getCourseById(id: string): Promise<CourseWithBasicRelations | null> {
  if (!id) {
    throw new Error("Course ID is required")
  }

  try {
    const course = await prisma.course.findUnique({
      where: { 
        id: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        volumes: {
          include: {
            _count: {
              select: {
                chapters: true
              }
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        enrollments: {
          select: {
            userId: true,
          },
        },
      },
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

export async function enrollInCourse(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to enroll in a course")
  }

  const courseId = formData.get("courseId") as string
  if (!courseId) {
    throw new Error("Course ID is required")
  }

  try {
    await prisma.courseEnrollment.create({
      data: {
        userId: session.user.id,
        courseId,
      },
    })

    revalidatePath(`/courses/${courseId}`)
    return { success: true }
  } catch (error: unknown) {
    console.error("Failed to enroll in course:", error)
    throw new Error("Failed to enroll in course")
  }
}

/**
 * Get a course with its complete structure (volumes, chapters, modules, lessons)
 */
export async function getCourseWithStructure(id: string): Promise<CourseWithStructure | null> {
  if (!id) {
    throw new Error("Course ID is required")
  }

  try {
    const course = await prisma.course.findUnique({
      where: {
        id: id,
      },
      include: {
        volumes: {
          orderBy: {
            order: 'asc',
          },
          include: {
            chapters: {
              orderBy: {
                order: 'asc',
              },
              include: {
                modules: {
                  orderBy: {
                    order: 'asc',
                  },
                  include: {
                    lessons: {
                      orderBy: {
                        order: 'asc',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    
    return course
  } catch (error) {
    console.error("Error fetching course structure:", error)
    return null
  }
} 