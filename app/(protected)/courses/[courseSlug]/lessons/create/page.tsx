import LessonSummaryClient from './_components/LessonSummaryClient'
import { getAuthUser } from '@/lib/auth/get-user'
import { getEnhancedPrisma } from '@/lib/db/enhanced'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ courseSlug: string }>
}

export default async function Page({ params }: PageProps) {
  const { courseSlug } = await params
  const user = await getAuthUser()
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
    <LessonSummaryClient
      courseSlug={courseSlug}
      courseId={course.id}
      modules={course.modules}
    />
  )
}
