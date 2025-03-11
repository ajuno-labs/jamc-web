import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { VolumeCard } from "../_components/volume-card"
import { CourseRelatedQuestions } from "../_components/course-related-questions"
import { CourseHeader } from "../_components/course-header"
import { Volume } from "@prisma/client"

interface CoursePageProps {
  params: {
    courseId: string
  }
}

interface CourseWithRelations {
  id: string
  title: string
  description: string
  slug: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  tags: {
    id: string
    name: string
  }[]
  volumes: (Volume & {
    _count: {
      chapters: number
    }
  })[]
  enrollments: {
    userId: string
  }[]
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await auth()

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      volumes: {
        include: {
          _count: {
            select: {
              chapters: true
            }
          },
        },
        orderBy: {
          order: "asc",
        },
      },
      enrollments: {
        where: {
          userId: session?.user?.id,
        },
        select: {
          userId: true,
        },
      },
    },
  }) as CourseWithRelations | null

  if (!course) {
    notFound()
  }

  const isEnrolled = course.enrollments.length > 0

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CourseHeader
            title={course.title}
            description={course.description}
            author={course.author}
            tags={course.tags}
            isEnrolled={isEnrolled}
            courseId={course.id}
            userId={session?.user?.id}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.volumes.map((volume) => (
              <VolumeCard
                key={volume.id}
                id={volume.id}
                title={volume.title}
                overview={volume.overview}
                slug={volume.slug}
                chapterCount={volume._count.chapters}
                courseId={course.id}
                courseTitle={course.title}
                courseSlug={course.slug}
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Course Progress</h3>
            {/* TODO: Add course progress component */}
          </Card>
          <CourseRelatedQuestions courseId={course.id} />
        </div>
      </div>
    </div>
  )
} 