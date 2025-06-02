export type NodeType = "module" | "chapter" | "lesson";

export interface TreeNode {
  id: string;
  type: NodeType;
  title: string;
  children: TreeNode[];
}

export type CourseStructure = TreeNode[];

// We store the full course hierarchy in the JSON `structure` field on Course
// Legacy Volume/Chapter/Module multi-layer types have been removed.

export interface LessonCardProps {
  id: string;
  title: string;
  slug: string;
  activityCount: number;
  summary: string | null;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
}
