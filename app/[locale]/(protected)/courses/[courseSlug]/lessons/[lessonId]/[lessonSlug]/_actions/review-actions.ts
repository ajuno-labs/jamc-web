"use server";

import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { questionReviewSelectArgs } from "@/lib/db/query-args";

export async function getReviewQuestions(lessonId: string) {
  if (!lessonId) {
    throw new Error("Lesson ID is required");
  }

  const prisma = await getEnhancedPrisma();
  
  // Get all questions for this lesson
  const questions = await prisma.question.findMany({
    where: { lessonId },
    select: questionReviewSelectArgs,
    orderBy: { createdAt: "desc" },
  });

  // Return up to 3 random questions
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
} 