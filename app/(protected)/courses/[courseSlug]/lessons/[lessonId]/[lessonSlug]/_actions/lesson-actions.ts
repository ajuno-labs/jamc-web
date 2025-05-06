"use server";

import { prisma } from "@/lib/db/prisma";
import { getAuthUser } from "@/lib/auth/get-user";
import { Prisma } from "@prisma/client";

export type LessonWithCourse = Prisma.LessonGetPayload<{
  include: {
    course: {
      include: {
        enrollments: {
          select: {
            userId: true;
          };
        };
        author: {
          select: {
            id: true;
          };
        };
        lessons: {
          orderBy: {
            order: "asc";
          };
          select: {
            id: true;
            title: true;
            slug: true;
            order: true;
          };
        };
      };
    };
  };
}>;

export type LessonWithNavigation = LessonWithCourse;

/**
 * Get a lesson by ID with course info for navigation
 */
export async function getLessonById(
  id: string
): Promise<LessonWithNavigation | null> {
  if (!id) {
    throw new Error("Lesson ID is required");
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            enrollments: {
              select: {
                userId: true,
              },
            },
            author: {
              select: {
                id: true,
              },
            },
            lessons: {
              orderBy: {
                order: "asc",
              },
              select: {
                id: true,
                title: true,
                slug: true,
                order: true,
              },
            },
          },
        },
      },
    });

    return lesson;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }
}

/**
 * Check if a user can access a lesson
 */
export async function canAccessLesson(
  lesson: LessonWithCourse
): Promise<boolean> {
  const user = await getAuthUser();
  if (!user) return false;
  const userId = user.id;

  // Author can always access
  if (lesson.course.author.id === userId) return true;

  // Check if user is enrolled
  return lesson.course.enrollments.some((e) => e.userId === userId);
}
