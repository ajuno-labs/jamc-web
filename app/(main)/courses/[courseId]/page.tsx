import { prisma } from "@/lib/db/prisma"
import { notFound, redirect } from "next/navigation"

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    select: {
      slug: true,
    },
  })

  if (!course) {
    notFound()
  }

  // Redirect to the slugged URL
  redirect(`/courses/${params.courseId}/${course.slug}`)
} 