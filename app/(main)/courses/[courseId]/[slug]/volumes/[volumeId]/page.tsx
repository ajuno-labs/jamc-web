import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { VolumeHeader } from "../../../_components/volume-header"
import { VolumeContent } from "../../../_components/volume-content"
import { CourseRelatedQuestions } from "../../../../_components/course-related-questions"

interface VolumePageProps {
  params: {
    courseId: string
    volumeId: string
  }
}

export default async function VolumePage({ params }: VolumePageProps) {
  const session = await auth()

  const volume = await prisma.volume.findUnique({
    where: {
      id: params.volumeId,
    },
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
      chapters: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  activities: true,
                },
              },
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!volume) {
    notFound()
  }

  const isEnrolled = volume.course.enrollments.length > 0

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <VolumeHeader
            title={volume.title}
            overview={volume.overview}
            courseId={volume.courseId}
          />
          <VolumeContent
            chapters={volume.chapters}
            courseId={volume.courseId}
            volumeId={volume.id}
            isEnrolled={isEnrolled}
          />
        </div>
        <div className="space-y-6">
          <CourseRelatedQuestions
            courseId={volume.courseId}
            volumeId={volume.id}
          />
        </div>
      </div>
    </div>
  )
} 