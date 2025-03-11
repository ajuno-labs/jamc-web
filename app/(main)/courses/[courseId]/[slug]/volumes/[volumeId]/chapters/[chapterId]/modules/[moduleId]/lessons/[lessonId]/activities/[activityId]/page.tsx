import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { ActivityHeader } from "@/components/activity-header"
import { ActivityContent } from "@/components/activity-content"
import { CourseRelatedQuestions } from "@/components/course-related-questions"

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

  if (!activity || !activity.lesson.module.chapter) {
    notFound()
  }

  const isEnrolled = activity.lesson.module.chapter.volume.course.enrollments.length > 0

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityHeader
            title={activity.title}
            courseId={activity.lesson.module.chapter.volume.course.id}
            volumeId={activity.lesson.module.chapter.volume.id}
            chapterId={activity.lesson.module.chapter.id}
            moduleId={activity.lesson.module.id}
            lessonId={activity.lesson.id}
          />
          <ActivityContent
            content={activity.description || ""}
            type={activity.problemSet ? "Problem Set" : "Theory"}
            courseId={activity.lesson.module.chapter.volume.course.id}
            volumeId={activity.lesson.module.chapter.volume.id}
            chapterId={activity.lesson.module.chapter.id}
            moduleId={activity.lesson.module.id}
            lessonId={activity.lesson.id}
            activityId={activity.id}
            isEnrolled={isEnrolled}
          />
        </div>
        <div className="space-y-6">
          <CourseRelatedQuestions
            courseId={activity.lesson.module.chapter.volume.course.id}
            volumeId={activity.lesson.module.chapter.volume.id}
            chapterId={activity.lesson.module.chapter.id}
            moduleId={activity.lesson.module.id}
            lessonId={activity.lesson.id}
            activityId={activity.id}
          />
        </div>
      </div>
    </div>
  )
} 