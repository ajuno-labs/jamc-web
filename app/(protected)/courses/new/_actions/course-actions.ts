"use server";

import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { getAuthUser } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import type { TreeNode } from "@/lib/types/course-structure";
import { Prisma } from "@prisma/client";

export async function createCourse(formData: FormData) {
  const user = await getAuthUser();
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
  try {
    const course = await db.course.create({
      data: {
        title,
        description,
        slug,
        authorId: user.id,
        ...(normalizedStructure
          ? {
              structure:
                normalizedStructure as unknown as Prisma.InputJsonValue,
            }
          : {}),
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });

    // Create Lesson records for each 'lesson' node in the structure
    if (normalizedStructure) {
      type StructureNode = {
        id: string;
        type: string;
        title: string;
        children?: StructureNode[];
      };
      const lessonNodes: StructureNode[] = [];
      function traverse(nodes: StructureNode[]) {
        for (const node of nodes) {
          if (node.type === "lesson") lessonNodes.push(node);
          if (node.children) traverse(node.children);
        }
      }
      traverse(normalizedStructure as StructureNode[]);

      let lessonOrder = 1;
      for (const node of lessonNodes) {
        // Upsert lesson: create or skip if already exists
        await db.lesson.upsert({
          where: { courseId_slug: { courseId: course.id, slug: node.id } },
          create: {
            title: node.title,
            slug: node.id,
            summary: null,
            order: lessonOrder,
            courseId: course.id,
          },
          update: {
            title: node.title,
            order: lessonOrder,
          },
        });
        lessonOrder++;
      }
    }

    // Revalidate both list and detail pages
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.id}`);
    return { success: true, slug };
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}

export async function createLesson(formData: FormData) {
  const user = await getAuthUser();
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
  try {
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
  } catch (error) {
    console.error("Error creating lesson:", error);
    throw error;
  }
}
