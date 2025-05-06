import type { CourseStructure, TreeNode } from "@/lib/types/course-structure";
import type { Lesson } from "@prisma/client";

/**
 * Parse raw JSON stored in course.structure into typed CourseStructure
 */
export function parseRawStructure(raw: unknown): CourseStructure {
  if (!Array.isArray(raw)) return [];
  return raw as unknown as CourseStructure;
}

/**
 * Given structure and lessons, return a map of id → lesson and a flat list of lesson IDs
 */
export function buildLessonMap(
  structure: CourseStructure,
  lessons: Lesson[]
): { lessonMap: Map<string, Lesson>; flatLessonIds: string[] } {
  // Map structure node.id (lesson.slug) to lesson records
  const lessonMap = new Map<string, Lesson>();
  lessons.forEach((l) => lessonMap.set(l.slug, l));

  const flatLessonIds: string[] = [];
  function traverse(nodes: TreeNode[]) {
    for (const n of nodes) {
      if (n.type === "lesson") {
        flatLessonIds.push(n.id);
      }
      if (n.children.length) {
        traverse(n.children);
      }
    }
  }
  traverse(structure);

  return { lessonMap, flatLessonIds };
}

/**
 * Build display info (title and optional parent title) for each lesson ID.
 */
export function buildDisplayInfo(
  structure: CourseStructure
): Record<string, { title: string; parentTitle?: string }> {
  const info: Record<string, { title: string; parentTitle?: string }> = {};

  function traverse(nodes: TreeNode[], parentTitle?: string) {
    for (const n of nodes) {
      if (n.type === "lesson") {
        info[n.id] = { title: n.title, parentTitle };
      }
      if (n.children.length) {
        traverse(n.children, n.type !== "lesson" ? n.title : parentTitle);
      }
    }
  }

  traverse(structure);
  return info;
}
