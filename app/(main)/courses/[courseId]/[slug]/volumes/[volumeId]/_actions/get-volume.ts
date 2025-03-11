import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"

export async function getVolume(volumeId: string) {
  const session = await auth()

  const volume = await prisma.volume.findUnique({
    where: {
      id: volumeId,
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

  return {
    volume,
    isEnrolled: volume.course.enrollments.length > 0,
  }
} 