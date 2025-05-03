'use server'

import { notFound } from 'next/navigation'
import { getAuthUser } from '@/lib/auth/get-user'
import { getEnhancedPrisma } from '@/lib/db/enhanced'

/**
 * Server helper to ensure instructor access and load course questions
 */
export async function getTeacherCourseData(courseSlug: string) {
  // Authenticate user
  const user = await getAuthUser()
  if (!user) {
    notFound()
  }

  // Load course and check instructor
  const db = await getEnhancedPrisma()
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true, authorId: true, title: true }
  })
  if (!course || course.authorId !== user.id) {
    notFound()
  }

  // Load all questions for the course
  const rawQuestions = await db.question.findMany({
    where: { courseId: course.id },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { answers: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return { course, rawQuestions }
} 