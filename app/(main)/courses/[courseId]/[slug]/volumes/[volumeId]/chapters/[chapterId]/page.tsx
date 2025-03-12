import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { ChapterHeader } from "./_components/chapter-header"
import { ChapterContent } from "./_components/chapter-content"
import { CourseRelatedQuestions } from "@/components/course-related-questions"

interface ChapterPageProps {
  params: {
    courseId: string
    volumeId: string
    chapterId: string
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const session = await auth()

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: params.chapterId,
    },
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
      modules: {
        include: {
          lessons: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!chapter) {
    notFound()
  }

  const isEnrolled = chapter.volume.course.enrollments.length > 0

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChapterHeader
            title={chapter.title}
            introduction={chapter.introduction}
            courseId={chapter.volume.courseId}
            volumeId={chapter.volumeId}
          />
          <ChapterContent
            modules={chapter.modules}
            courseId={chapter.volume.courseId}
            volumeId={chapter.volumeId}
            chapterId={chapter.id}
            isEnrolled={isEnrolled}
          />
        </div>
        <div className="space-y-6">
          <CourseRelatedQuestions
            courseId={chapter.volume.courseId}
            volumeId={chapter.volumeId}
            chapterId={chapter.id}
          />
        </div>
      </div>
    </div>
  )
} 