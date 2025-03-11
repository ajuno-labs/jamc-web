import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { ActivityHeader } from "../../../../../../../_components/activity-header"
import { ActivityContent } from "../../../../../../../_components/activity-content"
import { CourseRelatedQuestions } from "../../../../../../../_components/course-related-questions"

interface ActivityPageProps {
  params: {
    courseId: string
    volumeId: string
    chapterId: string
    moduleId: string
    lessonId: string
    activityId: string
  }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const session = await auth()

  const activity = await prisma.activity.findUnique({
    where: {
      id: params.activityId,
    },
    include: {
      lesson: {
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
        },
      },
    },
  })

  if (!activity) {
    notFound()
  }

  const isEnrolled = activity.lesson.module.chapter.volume.course.enrollments.length > 0

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityHeader
            title={activity.title}
            courseId={activity.lesson.module.chapter.volume.courseId}
            volumeId={activity.lesson.module.chapter.volumeId}
            chapterId={activity.lesson.module.chapterId}
            moduleId={activity.lesson.moduleId}
            lessonId={activity.lessonId}
          />
          <ActivityContent
            content={activity.content}
            type={activity.type}
            courseId={activity.lesson.module.chapter.volume.courseId}
            volumeId={activity.lesson.module.chapter.volumeId}
            chapterId={activity.lesson.module.chapterId}
            moduleId={activity.lesson.moduleId}
            lessonId={activity.lessonId}
            activityId={activity.id}
            isEnrolled={isEnrolled}
          />
        </div>
        <div className="space-y-6">
          <CourseRelatedQuestions
            courseId={activity.lesson.module.chapter.volume.courseId}
            volumeId={activity.lesson.module.chapter.volumeId}
            chapterId={activity.lesson.module.chapterId}
            moduleId={activity.lesson.moduleId}
            lessonId={activity.lessonId}
            activityId={activity.id}
          />
        </div>
      </div>
    </div>
  )
} 