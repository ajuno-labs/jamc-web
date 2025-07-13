"use server"

import { getAuthUser } from "@/lib/auth"
import { getEnhancedPrisma } from "@/lib/db/enhanced"
import { notFound } from "next/navigation"
import type { 
  StudentActivityMetrics, 
  CourseActivitySummary, 
  ActivityCalculationOptions,
  StudentActivityState 
} from "@/lib/types/student-activity"

/**
 * Calculate student activity state based on their recent activity
 */
function calculateActivityState(
  lastActivityAt: Date | null, 
  options: ActivityCalculationOptions = {}
): StudentActivityState {
  const { activeDays = 7, atRiskDays = 14 } = options
  
  if (!lastActivityAt) {
    return 'inactive'
  }
  
  const now = new Date()
  const daysSinceActivity = Math.floor((now.getTime() - lastActivityAt.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceActivity <= activeDays) {
    return 'active'
  } else if (daysSinceActivity <= atRiskDays) {
    return 'at-risk'
  } else {
    return 'inactive'
  }
}

/**
 * Get detailed activity metrics for all students in a course
 */
export async function getCourseStudentActivity(
  courseSlug: string,
  options: ActivityCalculationOptions = {}
): Promise<CourseActivitySummary> {
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
      title: true, 
      authorId: true,
      lessons: { select: { id: true } }
    }
  })
  
  if (!course || course.authorId !== user.id) {
    notFound()
  }

  const { activeDays = 7 } = options
  const sevenDaysAgo = new Date(Date.now() - activeDays * 24 * 60 * 60 * 1000)
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  // Get all enrolled students with their activity data
  const enrollments = await db.courseEnrollment.findMany({
    where: { courseId: course.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          // All lesson views for this course
          lessonViews: {
            where: {
              lesson: { courseId: course.id }
            },
            select: { lessonId: true, viewedAt: true }
          },
          // Recent questions
          questions: {
            where: {
              courseId: course.id,
              createdAt: { gte: sevenDaysAgo }
            },
            select: { createdAt: true }
          },
          // Recent answers
          answers: {
            where: {
              question: { courseId: course.id },
              createdAt: { gte: sevenDaysAgo }
            },
            select: { createdAt: true }
          },
          // Recent votes
          questionVotes: {
            where: {
              question: { courseId: course.id },
              createdAt: { gte: sevenDaysAgo }
            },
            select: { createdAt: true }
          },
          answerVotes: {
            where: {
              answer: { question: { courseId: course.id } },
              createdAt: { gte: sevenDaysAgo }
            },
            select: { createdAt: true }
          },
          // Activity logs for comprehensive tracking
          activityLogs: {
            where: {
              createdAt: { gte: sevenDaysAgo },
              OR: [
                { type: 'VIEW_LESSON' },
                { type: 'ASK_QUESTION' },
                { type: 'ANSWER_QUESTION' },
                { type: 'UPVOTE_QUESTION' },
                { type: 'DOWNVOTE_QUESTION' },
                { type: 'UPVOTE_ANSWER' },
                { type: 'DOWNVOTE_ANSWER' }
              ]
            },
            select: { createdAt: true, type: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const totalLessonsInCourse = course.lessons.length
  const studentsMetrics: StudentActivityMetrics[] = []
  
  let activeCount = 0
  let atRiskCount = 0
  let inactiveCount = 0
  let newThisWeekCount = 0
  let totalProgress = 0

  for (const enrollment of enrollments) {
    const enrollmentUser = enrollment.user
    
    // Count new enrollments this week
    if (enrollment.createdAt >= oneWeekAgo) {
      newThisWeekCount++
    }

    // Filter recent lesson views
    const recentLessonViews = enrollmentUser.lessonViews.filter((v: { viewedAt: Date }) => v.viewedAt >= sevenDaysAgo)

    // Calculate last activity date from multiple sources
    const allActivityDates = [
      ...recentLessonViews.map((v: { viewedAt: Date }) => v.viewedAt),
      ...enrollmentUser.questions.map((q: { createdAt: Date }) => q.createdAt),
      ...enrollmentUser.answers.map((a: { createdAt: Date }) => a.createdAt),
      ...enrollmentUser.questionVotes.map((v: { createdAt: Date }) => v.createdAt),
      ...enrollmentUser.answerVotes.map((v: { createdAt: Date }) => v.createdAt),
      ...enrollmentUser.activityLogs.map((a: { createdAt: Date }) => a.createdAt)
    ]
    
    const lastActivityAt = allActivityDates.length > 0 
      ? new Date(Math.max(...allActivityDates.map(d => d.getTime())))
      : null

    // Calculate activity state
    const activityState = calculateActivityState(lastActivityAt, options)
    
    // Count by state
    switch (activityState) {
      case 'active': activeCount++; break
      case 'at-risk': atRiskCount++; break
      case 'inactive': inactiveCount++; break
    }

    // Calculate progress
    const uniqueLessonsViewed = new Set(enrollmentUser.lessonViews.map((v: { lessonId: string }) => v.lessonId)).size
    const progressPercentage = totalLessonsInCourse > 0 
      ? Math.round((uniqueLessonsViewed / totalLessonsInCourse) * 100)
      : 0
    
    totalProgress += progressPercentage

    // Create student metrics
    const studentMetrics: StudentActivityMetrics = {
      id: enrollmentUser.id,
      name: enrollmentUser.name || 'Unknown',
      email: enrollmentUser.email,
      image: enrollmentUser.image,
      enrolledAt: enrollment.createdAt,
      lastActivityAt,
      activityState,
      lessonsViewedCount: recentLessonViews.length,
      questionsAskedCount: enrollmentUser.questions.length,
      answersGivenCount: enrollmentUser.answers.length,
      votesGivenCount: enrollmentUser.questionVotes.length + enrollmentUser.answerVotes.length,
      totalLessonsInCourse,
      lessonsViewedTotal: uniqueLessonsViewed,
      progressPercentage
    }
    
    studentsMetrics.push(studentMetrics)
  }

  // Students needing attention (at-risk + inactive)
  const studentsNeedingAttention = studentsMetrics.filter(
    s => s.activityState === 'at-risk' || s.activityState === 'inactive'
  )

  const averageProgressPercentage = enrollments.length > 0 
    ? Math.round(totalProgress / enrollments.length)
    : 0

  return {
    courseId: course.id,
    courseTitle: course.title,
    totalStudents: enrollments.length,
    activeStudents: activeCount,
    atRiskStudents: atRiskCount,
    inactiveStudents: inactiveCount,
    newStudentsThisWeek: newThisWeekCount,
    averageProgressPercentage,
    studentsNeedingAttention
  }
}

/**
 * Get simplified student list with activity states for the dashboard
 */
export async function getCourseStudentsList(courseSlug: string) {
  const summary = await getCourseStudentActivity(courseSlug)
  
  // Get all students with their metrics
  const db = await getEnhancedPrisma()
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true }
  })
  
  if (!course) {
    notFound()
  }

  const enrollments = await db.courseEnrollment.findMany({
    where: { courseId: course.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          lessonViews: {
            where: { lesson: { courseId: course.id } },
            select: { lessonId: true, viewedAt: true }
          },
          questions: {
            where: { courseId: course.id },
            select: { createdAt: true }
          },
          activityLogs: {
            where: {
              createdAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }
            },
            select: { createdAt: true }
          }
        }
      }
    }
  })

  return enrollments.map(enrollment => {
    const enrollmentUser = enrollment.user
    
    // Calculate last activity
    const allActivityDates = [
      ...enrollmentUser.lessonViews.map((v: { viewedAt: Date }) => v.viewedAt),
      ...enrollmentUser.questions.map((q: { createdAt: Date }) => q.createdAt),
      ...enrollmentUser.activityLogs.map((a: { createdAt: Date }) => a.createdAt)
    ]
    
    const lastActivityAt = allActivityDates.length > 0 
      ? new Date(Math.max(...allActivityDates.map(d => d.getTime())))
      : null

    const activityState = calculateActivityState(lastActivityAt)
    
    return {
      id: enrollmentUser.id,
      name: enrollmentUser.name || 'Unknown',
      email: enrollmentUser.email,
      image: enrollmentUser.image,
      lastActivityAt,
      activityState,
      questionsAsked: enrollmentUser.questions.length,
      progress: summary.studentsNeedingAttention.find(s => s.id === enrollmentUser.id)?.progressPercentage || 0
    }
  })
} 
