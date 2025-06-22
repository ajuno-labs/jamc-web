'use server'

import { getAuthUser } from '@/lib/auth/get-user'
import { getEnhancedPrisma } from '@/lib/db/enhanced'

export async function updateLesson(formData: FormData) {
  const user = await getAuthUser()
  if (!user) {
    throw new Error('Authentication required')
  }

  const lessonId = formData.get('lessonId')?.toString()
  if (!lessonId) {
    throw new Error('Lesson ID is required')
  }

  const db = await getEnhancedPrisma()

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  })
  if (!lesson) {
    throw new Error('Lesson not found')
  }
  if (lesson.course.authorId !== user.id) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')?.toString() || lesson.title
  const summary = formData.get('summary')?.toString() || lesson.summary
  const metadataRaw = formData.get('metadata')?.toString() || '{}'
  const metadata = JSON.parse(metadataRaw)

  // TODO: Handle modules, chapters, and file uploads as needed

  await db.lesson.update({
    where: { id: lessonId },
    data: {
      title,
      summary,
      metadata,
    },
  })
} 