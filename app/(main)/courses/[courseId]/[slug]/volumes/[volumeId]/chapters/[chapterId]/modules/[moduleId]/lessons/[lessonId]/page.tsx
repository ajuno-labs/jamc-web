import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { LessonHeader } from "@/components/lesson-header"
import { LessonContent } from "@/components/lesson-content"
import { CourseRelatedQuestions } from "@/components/course-related-questions"

interface LessonPageProps {
  params: {
    courseId: string
    volumeId: string
    chapterId: string
    moduleId: string
    lessonId: string
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await auth()

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: params.lessonId,
    },
    include: {
      module: {
        include: {
          chapter: {
            include: {
              volume: {
                include: {
                  course: {
                    include: {
                      enrollments: {
                        where: {
                          userId: session?.user?.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      activities: {
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!lesson) {
    notFound()
  }

  if (!lesson.module || !lesson.module.chapter || !lesson.module.chapter.volume || !lesson.module.chapter.volume.course) {
    notFound()
  }

  const courseId = lesson.module.chapter.volume.course.id
  const volumeId = lesson.module.chapter.volume.id
  const chapterId = lesson.module.chapter.id
  const moduleId = lesson.module.id
  const isEnrolled = lesson.module.chapter.volume.course.enrollments.length > 0

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LessonHeader
            title={lesson.title}
            courseId={courseId}
            volumeId={volumeId}
            chapterId={chapterId}
            moduleId={moduleId}
          />
          <LessonContent
            activities={lesson.activities}
            courseId={courseId}
            volumeId={volumeId}
            chapterId={chapterId}
            moduleId={moduleId}
            lessonId={lesson.id}
            isEnrolled={isEnrolled}
          />
        </div>
        <div className="space-y-6">
          <CourseRelatedQuestions
            courseId={courseId}
            volumeId={volumeId}
            chapterId={chapterId}
            moduleId={moduleId}
            lessonId={lesson.id}
            activityId={null}
          />
        </div>
      </div>
    </div>
  )
} 