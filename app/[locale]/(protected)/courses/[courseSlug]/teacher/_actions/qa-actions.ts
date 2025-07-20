'use server'

import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/user'
import { getEnhancedPrisma } from '@/lib/db/enhanced'
import { 
  courseBasicSelectArgs,
  questionBasicIncludeArgs,
  type CourseBasic,
  type QuestionWithAuthor
} from '@/lib/db/query-args'

// Return type for the function
type TeacherCourseData = {
  course: CourseBasic
  rawQuestions: QuestionWithAuthor[]
}

/**
 * Server helper to ensure instructor access and load course questions
 */
export async function getTeacherCourseData(courseSlug: string): Promise<TeacherCourseData> {
  // Authenticate user
  const user = await getCurrentUser()
  if (!user) {
    notFound()
  }

  // Load course and check instructor
  const db = await getEnhancedPrisma()
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: courseBasicSelectArgs
  })
  if (!course || course.authorId !== user.id) {
    notFound()
  }

  // Load all questions for the course
  const rawQuestions = await db.question.findMany({
    where: { courseId: course.id },
    include: questionBasicIncludeArgs,
    orderBy: { createdAt: 'desc' }
  })

  return { course, rawQuestions }
} 
