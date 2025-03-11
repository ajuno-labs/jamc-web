import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"

export async function getModule(moduleId: string) {
  const session = await auth()

  const module = await prisma.module.findUnique({
    where: {
      id: moduleId,
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

  return {
    module,
    isEnrolled: module.chapter.volume.course.enrollments.length > 0,
  }
} 