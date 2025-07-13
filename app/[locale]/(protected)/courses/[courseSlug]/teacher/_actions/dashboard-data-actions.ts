"use server"

import { getAuthUser } from "@/lib/auth"
import { getEnhancedPrisma } from "@/lib/db/enhanced"
import { notFound } from "next/navigation"
import type { WeeklyActivityData, ModuleProgressData, EnrollmentTrendData } from "@/lib/types/dashboard"

/**
 * Get weekly activity data for the last 7 days
 */
export async function getWeeklyActivityData(courseSlug: string): Promise<WeeklyActivityData[]> {
  const user = await getAuthUser()
  if (!user) {
    notFound()
  }

  const db = await getEnhancedPrisma()
  
  // Verify course ownership
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true, authorId: true }
  })
  
  if (!course || course.authorId !== user.id) {
    notFound()
  }

  const weeklyData: WeeklyActivityData[] = []
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    
    // Get active users (students who did any activity on this day)
    const activeUsers = await db.activityLog.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        },
        user: {
          enrolledCourses: {
            some: {
              courseId: course.id
            }
          }
        }
      },
      select: { userId: true },
      distinct: ['userId']
    })

    // Get questions asked on this day
    const questionsAsked = await db.question.count({
      where: {
        courseId: course.id,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    })

    const dayOfWeek = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1] // Convert Sunday=0 to be last
    
    weeklyData.push({
      name: dayOfWeek,
      "Active Users": activeUsers.length,
      "Questions Asked": questionsAsked
    })
  }

  return weeklyData
}

/**
 * Get module completion data for the course
 */
export async function getModuleCompletionData(courseSlug: string): Promise<ModuleProgressData[]> {
  const user = await getAuthUser()
  if (!user) {
    notFound()
  }

  const db = await getEnhancedPrisma()
  
  // Verify course ownership
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: { 
      id: true, 
      authorId: true,
      modules: {
        include: {
          chapters: {
            include: {
              lessons: {
                select: { id: true }
              }
            }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  })
  
  if (!course || course.authorId !== user.id) {
    notFound()
  }

  // Get total enrolled students
  const totalStudents = await db.courseEnrollment.count({
    where: { courseId: course.id }
  })

  if (totalStudents === 0) {
    return course.modules.map((courseModule: { id: string; title: string }) => ({
      id: courseModule.id,
      title: courseModule.title,
      completionPercentage: 0
    }))
  }

  const moduleProgressData: ModuleProgressData[] = []

  for (const courseModule of course.modules) {
    // Get all lesson IDs in this module
    const lessonIds = courseModule.chapters.flatMap((chapter: { lessons: { id: string }[] }) => 
      chapter.lessons.map((lesson: { id: string }) => lesson.id)
    )

    if (lessonIds.length === 0) {
      moduleProgressData.push({
        id: courseModule.id,
        title: courseModule.title,
        completionPercentage: 0
      })
      continue
    }

    // Count students who have viewed ALL lessons in this module
    let studentsCompletedModule = 0

    // Get all enrolled students
    const enrolledStudents = await db.courseEnrollment.findMany({
      where: { courseId: course.id },
      select: { userId: true }
    })

    for (const enrollment of enrolledStudents) {
      // Check if this student has viewed all lessons in the module
      const viewedLessonsCount = await db.lessonView.count({
        where: {
          userId: enrollment.userId,
          lessonId: { in: lessonIds }
        }
      })

      if (viewedLessonsCount === lessonIds.length) {
        studentsCompletedModule++
      }
    }

    const completionPercentage = Math.round((studentsCompletedModule / totalStudents) * 100)

    moduleProgressData.push({
      id: courseModule.id,
      title: courseModule.title,
      completionPercentage
    })
  }

  return moduleProgressData
}

/**
 * Get enrollment trend data for the last 7 weeks
 */
export async function getEnrollmentTrendData(courseSlug: string): Promise<EnrollmentTrendData[]> {
  const user = await getAuthUser()
  if (!user) {
    notFound()
  }

  const db = await getEnhancedPrisma()
  
  // Verify course ownership
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true, authorId: true }
  })
  
  if (!course || course.authorId !== user.id) {
    notFound()
  }

  const enrollmentData: EnrollmentTrendData[] = []
  
  for (let i = 6; i >= 0; i--) {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() - (i * 7))
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - 7)
    
    // Get total enrollments up to this point
    const totalEnrolled = await db.courseEnrollment.count({
      where: {
        courseId: course.id,
        createdAt: {
          lte: endDate
        }
      }
    })

    // Get active students in this week (students who had any activity)
    const activeStudentsThisWeek = await db.activityLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        user: {
          enrolledCourses: {
            some: {
              courseId: course.id
            }
          }
        }
      },
      select: { userId: true },
      distinct: ['userId']
    })

    const weekLabel = `Week ${7 - i}`
    
    enrollmentData.push({
      name: weekLabel,
      "Total Enrolled": totalEnrolled,
      "Active Students": activeStudentsThisWeek.length
    })
  }

  return enrollmentData
} 
