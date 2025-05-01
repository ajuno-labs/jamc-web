"use server"

import { prisma } from "@/lib/db/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

export interface Course {
  id: string
  title: string
  description: string
  slug: string
  author: {
    id: string
    name: string
    image: string | null
  }
  tags: {
    id: string
    name: string
  }[]
  lessonCount: number
  enrollmentCount: number
  createdAt: Date
}

export type CourseWithLessons = Prisma.CourseGetPayload<{
  include: {
    author: {
      select: {
        id: true
        name: true
        image: true
      }
    }
    lessons: {
      orderBy: {
        order: 'asc'
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
    lessons: {
      select: {
        id: true
        title: true
        slug: true
        order: true
      }
      orderBy: {
        order: 'asc'
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
}): Promise<Course[]> {
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
        lessons: {
          select: {
            id: true,
          },
        },
        enrollments: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Transform the data for the frontend
    return courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      slug: course.slug,
      author: {
        id: course.author.id,
        name: course.author.name || 'Unknown',
        image: course.author.image,
      },
      tags: course.tags,
      lessonCount: course.lessons.length,
      enrollmentCount: course.enrollments.length,
      createdAt: course.createdAt,
    }))
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
        lessons: {
          select: {
            id: true,
            title: true,
            slug: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
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
 * Get a course with its lessons
 */
export async function getCourseWithLessons(id: string): Promise<CourseWithLessons | null> {
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
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })
    
    return course
  } catch (error) {
    console.error("Error fetching course lessons:", error)
    return null
  }
}

// Server action to fetch all courses the current user is enrolled in or has authored, including lessons
export async function getMyCoursesWithLessons() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('You must be signed in to view your courses')
  }

  // Fetch courses the user is enrolled in
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { user: { email: session.user.email } },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          lessons: {
            select: { id: true, title: true, slug: true, order: true },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })
  const enrolledCourses = enrollments.map((e) => e.course)

  // Fetch courses the user has authored
  const authoredCourses = await prisma.course.findMany({
    where: { author: { email: session.user.email } },
    select: {
      id: true,
      title: true,
      slug: true,
      lessons: {
        select: { id: true, title: true, slug: true, order: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  // Merge and dedupe courses
  const allCourses: typeof authoredCourses = [...enrolledCourses]
  for (const course of authoredCourses) {
    if (!allCourses.find((c) => c.id === course.id)) {
      allCourses.push(course)
    }
  }

  return allCourses
} 