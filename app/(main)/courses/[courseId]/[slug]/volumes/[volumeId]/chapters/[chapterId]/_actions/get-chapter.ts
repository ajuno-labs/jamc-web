import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"

export async function getChapter(chapterId: string) {
  const session = await auth()

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
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

  return {
    chapter,
    isEnrolled: chapter.volume.course.enrollments.length > 0,
  }
} 