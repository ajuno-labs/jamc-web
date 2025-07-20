"use server";

import { getCurrentUser } from "@/lib/auth/user";
import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { Prisma } from "@prisma/client";

/**
 * Server action to mark the current lesson as viewed by the authenticated user.
 */
export async function markLessonViewed(lessonId: string) {
  if (!lessonId) {
    throw new Error("Lesson ID is required");
  }

  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const db = await getEnhancedPrisma();
  await db.lessonView.upsert({
    where: {
      userId_lessonId: { userId: user.id, lessonId },
    },
    create: { userId: user.id, lessonId },
    update: {},
  });
}

/**
 * Server action to unmark the current lesson as viewed by the authenticated user.
 */
export async function unmarkLessonViewed(lessonId: string) {
  if (!lessonId) {
    throw new Error("Lesson ID is required");
  }

  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const db = await getEnhancedPrisma();
  try {
    await db.lessonView.delete({
      where: { userId_lessonId: { userId: user.id, lessonId } },
    });
  } catch (error) {
    // Ignore if no record to delete
    if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")) {
      throw error;
    }
  }
}
