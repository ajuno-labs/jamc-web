import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { LessonHeader } from "../../../../../../_components/lesson-header"
import { LessonContent } from "../../../../../../_components/lesson-content"
import { CourseRelatedQuestions } from "../../../../../../_components/course-related-questions"

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

  const isEnrolled = lesson.module.chapter.volume.course.enrollments.length > 0

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LessonHeader
            title={lesson.title}
            courseId={lesson.module.chapter.volume.courseId}
            volumeId={lesson.module.chapter.volumeId}
            chapterId={lesson.module.chapterId}
            moduleId={lesson.moduleId}
          />
          <LessonContent
            activities={lesson.activities}
            courseId={lesson.module.chapter.volume.courseId}
            volumeId={lesson.module.chapter.volumeId}
            chapterId={lesson.module.chapterId}
            moduleId={lesson.moduleId}
            lessonId={lesson.id}
            isEnrolled={isEnrolled}
          />
        </div>
        <div className="space-y-6">
          <CourseRelatedQuestions
            courseId={lesson.module.chapter.volume.courseId}
            volumeId={lesson.module.chapter.volumeId}
            chapterId={lesson.module.chapterId}
            moduleId={lesson.moduleId}
            lessonId={lesson.id}
          />
        </div>
      </div>
    </div>
  )
} 