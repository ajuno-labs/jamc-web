"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import type { TreeNode } from "@/lib/types/course-structure";

export async function createCourse(formData: FormData) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });
  if (!user?.id) {
    throw new Error("Authentication required to create a course");
  }
  const db = await getEnhancedPrisma();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  if (!title || !description) {
    throw new Error("Title and description are required");
  }
  // Generate a unique slug
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  let slug = baseSlug;
  let suffix = 1;
  // Append suffix until unique
  while (await db.course.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }
  // Handle optional structure and tags
  const structureStr = formData.get("structure") as string | null;
  const parsedStructure = structureStr ? JSON.parse(structureStr) : undefined;
  // Normalize lesson IDs to unique slugified titles for consistent lookup
  let normalizedStructure: TreeNode[] | undefined;
  if (parsedStructure) {
    const slugSet = new Set<string>();
    const normalizeNodes = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((node) => {
        const children = node.children ? normalizeNodes(node.children) : [];
        let id = node.id;
        if (node.type === "lesson") {
          const base = slugify(node.title);
          let unique = base;
          let counter = 1;
          while (slugSet.has(unique)) {
            unique = `${base}-${counter++}`;
          }
          slugSet.add(unique);
          id = unique;
        }
        return { ...node, id, children };
      });
    normalizedStructure = normalizeNodes(parsedStructure as TreeNode[]);
  }
  const tags = formData.getAll("tags").map((tag) => tag as string);

  // First, create the base course
  const course = await db.course.create({
    data: {
      title,
      description,
      slug,
      authorId: user.id,
      tags: {
        connectOrCreate: tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  // Then sequentially create modules, chapters, and lessons
  if (normalizedStructure) {
    for (const [moduleIndex, moduleNode] of normalizedStructure.entries()) {
      const courseModule = await db.courseModule.create({
        data: {
          title: moduleNode.title,
          slug: moduleNode.id,
          order: moduleIndex + 1,
          courseId: course.id,
        },
      });
      for (const [chapterIndex, chapterNode] of moduleNode.children.entries()) {
        const chapter = await db.courseChapter.create({
          data: {
            title: chapterNode.title,
            slug: chapterNode.id,
            order: chapterIndex + 1,
            moduleId: courseModule.id,
          },
        });
        for (const [lessonIndex, lessonNode] of chapterNode.children.entries()) {
          await db.lesson.create({
            data: {
              title: lessonNode.title,
              slug: lessonNode.id,
              summary: null,
              order: lessonIndex + 1,
              chapterId: chapter.id,
              courseId: course.id,
            },
          });
        }
      }
    }
  }

  // Revalidate both list and detail pages
  revalidatePath("/courses");
  revalidatePath(`/courses/${course.id}`);
  return { success: true, slug };
}

export async function createLesson(formData: FormData) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });
  if (!user?.id) {
    throw new Error("Authentication required to create a lesson");
  }
  const db = await getEnhancedPrisma();
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string | null;
  if (!courseId || !title) {
    throw new Error("Course ID and title are required");
  }
  // Generate a unique lesson slug within the course
  const baseLessonSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  let lessonSlug = baseLessonSlug;
  let lessonSuffix = 1;
  while (await db.lesson.findFirst({ where: { courseId, slug: lessonSlug } })) {
    lessonSlug = `${baseLessonSlug}-${lessonSuffix}`;
    lessonSuffix++;
  }
  const lastLesson = await db.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const order = lastLesson ? lastLesson.order + 1 : 1;
  
  await db.lesson.create({
    data: {
      title,
      slug: lessonSlug,
      summary,
      courseId,
      order,
    },
  });
  revalidatePath(`/courses/${courseId}`);
  return { success: true };
}
