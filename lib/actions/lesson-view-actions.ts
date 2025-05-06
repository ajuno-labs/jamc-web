"use server";

import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { withActivity } from "@/lib/actions/withActivity";
import { ActivityType } from "@prisma/client";

// Business logic: upsert a LessonView for the user
async function _markViewed(userId: string, lessonId: string) {
  const db = await getEnhancedPrisma();
  await db.lessonView.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId },
    update: { viewedAt: new Date() },
  });
}

// Business logic: delete the LessonView for the user
async function _unview(userId: string, lessonId: string) {
  const db = await getEnhancedPrisma();
  await db.lessonView.delete({
    where: { userId_lessonId: { userId, lessonId } },
  });
}

// Server actions wrapped with activity logging
export const markLessonViewed = withActivity(
  ActivityType.VIEW_LESSON,
  "Lesson",
  _markViewed
);

export const unmarkLessonViewed = withActivity(
  ActivityType.UNVIEW_LESSON,
  "Lesson",
  _unview
);
