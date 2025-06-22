"use server";

import { getEnhancedPrisma } from "@/lib/db/enhanced";

export async function getReviewQuestions(lessonId: string) {
  if (!lessonId) {
    throw new Error("Lesson ID is required");
  }

  const prisma = await getEnhancedPrisma();
  
  // Get all questions for this lesson
  const questions = await prisma.question.findMany({
    where: { lessonId },
    select: {
      id: true,
      title: true,
      content: true,
      slug: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Return up to 3 random questions
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
} 