"use server";

import { getEnhancedPrisma } from "@/lib/db/enhanced";

/**
 * Fetch a single course (by slug) together with its syllabus hierarchy and
 * any lessons that are attached directly to the course (i.e. have no module / chapter).
 */
export async function getCourseDetail(courseSlug: string) {
  const db = await getEnhancedPrisma();

  return db.course.findUnique({
    where: { slug: courseSlug },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      // Hierarchical syllabus (modules -> chapters -> lessons)
      modules: {
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          chapters: {
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  order: true,
                },
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      // Top-level lessons that do **not** belong to a chapter (chapterId is null)
      lessons: {
        where: { chapterId: null },
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
        },
        orderBy: { order: "asc" },
      },
      enrollments: {
        select: { userId: true },
      },
      author: { select: { id: true, name: true, image: true } },
    },
  });
} 
