import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { ModuleHeader } from "../../../../../_components/module-header"
import { ModuleContent } from "../../../../../_components/module-content"
import { CourseRelatedQuestions } from "../../../../../_components/course-related-questions"

interface ModulePageProps {
  params: {
    courseId: string
    volumeId: string
    chapterId: string
    moduleId: string
  }
}

export default async function ModulePage({ params }: ModulePageProps) {
  const session = await auth()

  const module = await prisma.module.findUnique({
    where: {
      id: params.moduleId,
    },
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
      lessons: {
        include: {
          activities: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!module) {
    notFound()
  }

  const isEnrolled = module.chapter.volume.course.enrollments.length > 0

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ModuleHeader
            title={module.title}
            courseId={module.chapter.volume.courseId}
            volumeId={module.chapter.volumeId}
            chapterId={module.chapterId}
          />
          <ModuleContent
            lessons={module.lessons}
            courseId={module.chapter.volume.courseId}
            volumeId={module.chapter.volumeId}
            chapterId={module.chapterId}
            moduleId={module.id}
            isEnrolled={isEnrolled}
          />
        </div>
        <div className="space-y-6">
          <CourseRelatedQuestions
            courseId={module.chapter.volume.courseId}
            volumeId={module.chapter.volumeId}
            chapterId={module.chapterId}
            moduleId={module.id}
          />
        </div>
      </div>
    </div>
  )
} 