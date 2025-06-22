"use server";

import { getEnhancedPrisma } from "@/lib/db/enhanced";

export type LessonSummary = NonNullable<Awaited<ReturnType<typeof getLessonSummary>>>;

export async function getLessonSummary(lessonId: string) {
  if (!lessonId) {
    throw new Error("Lesson ID is required");
  }

  const prisma = await getEnhancedPrisma();
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          enrollments: {
            select: { userId: true },
          },
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, slug: true, order: true },
          },
        },
      },
      files: {
        select: { id: true, url: true, type: true },
      },
      questions: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true, image: true } },
          _count: { select: { votes: true, answers: true } },
        },
      },
    },
  });

  return lesson;
} 