import LessonForm from '../_components/LessonForm'
import { getCurrentUser } from '@/lib/auth/user'
import { getEnhancedPrisma } from '@/lib/db/enhanced'
import { notFound } from 'next/navigation'
import { createLesson } from './_actions/lesson-actions'

interface PageProps {
  params: Promise<{ courseSlug: string }>
}

export default async function Page({ params }: PageProps) {
  const { courseSlug } = await params
  const user = await getCurrentUser()
  if (!user) {
    notFound()
  }

  const db = await getEnhancedPrisma()
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: {
      id: true,
      modules: {
        select: {
          id: true,
          title: true,
          slug: true,
          chapters: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!course) {
    notFound()
  }

  return (
    <LessonForm
      courseSlug={courseSlug}
      courseId={course.id}
      modules={course.modules}
      onSubmit={createLesson}
      redirectUrl={`/courses/${courseSlug}`}
    />
  )
}
