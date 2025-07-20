"use server";

import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { getCurrentUser } from "@/lib/auth/user";

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

export async function getMyCoursesWithLessons() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("You must be signed in to view your courses");
  }
  const db = await getEnhancedPrisma();

  const enrollments = await db.courseEnrollment.findMany({
    where: { user: { email: user.email } },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          lessons: {
            select: { id: true, title: true, slug: true, order: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
  const enrolledCourses = enrollments.map((e) => e.course);

  const authoredCourses = await db.course.findMany({
    where: { author: { email: user.email } },
    select: {
      id: true,
      title: true,
      slug: true,
      lessons: {
        select: { id: true, title: true, slug: true, order: true },
        orderBy: { order: "asc" },
      },
    },
  });

  const allCourses: typeof authoredCourses = [...enrolledCourses];
  for (const course of authoredCourses) {
    if (!allCourses.find((c) => c.id === course.id)) {
      allCourses.push(course);
    }
  }

  return allCourses;
}
