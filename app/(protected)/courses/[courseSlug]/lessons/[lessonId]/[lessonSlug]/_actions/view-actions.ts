"use server";

import { getAuthUser } from "@/lib/auth/get-user";
import { getEnhancedPrisma } from "@/lib/db/enhanced";

/**
 * Server action to mark the current lesson as viewed by the authenticated user.
 */
export async function markLessonViewed(formData: FormData) {
  const lessonId = formData.get("lessonId");
  if (typeof lessonId !== "string") {
    throw new Error("Lesson ID is required");
  }

  const user = await getAuthUser();
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