import Link from "next/link";
import type { CourseStructure, TreeNode } from "@/lib/types/course-structure";
import type { Lesson } from "@prisma/client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, BookOpen } from "lucide-react";

export interface CourseContentProps {
  courseSlug: string;
  lessonMap: Map<string, Lesson>;
  structure: CourseStructure;
}

export function CourseContent({
  courseSlug,
  lessonMap,
  structure,
}: CourseContentProps) {
  function renderNode(node: TreeNode) {
    // Case 1: Flattened single-child modules/chapters (module with only one lesson)
    // This renders it as a direct linkable header for that single lesson.
    if (
      node.type !== "lesson" &&
      node.children.length === 1 &&
      node.children[0].type === "lesson"
    ) {
      const childLessonNode = node.children[0];
      const lesson = lessonMap.get(childLessonNode.id); // childLessonNode.id is the slug
      if (!lesson) return null;

      return (
        <div
          key={node.id} // Module's unique ID (slug)
          className="flex items-center gap-3 py-2.5 px-3 rounded-md bg-muted/40 mb-2 border border-transparent hover:border-primary/20 transition-colors"
        >
          <FolderKanban
            className="h-5 w-5 text-foreground/70 flex-shrink-0"
            aria-label={node.type}
          />
          <span className="text-sm font-semibold text-foreground/80">
            {node.title}
          </span>
          <span className="text-xs text-foreground/50 mx-0.5">›</span>
          <BookOpen
            className="h-4 w-4 text-primary/80 flex-shrink-0"
            aria-label="Lesson"
          />
          <Link
            href={`/courses/${courseSlug}/lessons/${lesson.id}/${lesson.slug}`}
            className="text-sm font-medium text-primary hover:underline truncate"
            title={lesson.title}
          >
            {lesson.title}
          </Link>
        </div>
      );
    }

    // Case 2: Leaf lesson node (rendered inside an accordion's content)
    if (node.type === "lesson") {
      const lesson = lessonMap.get(node.id); // node.id is the slug
      if (!lesson) return null;

      return (
        <Link
          key={node.id} // Lesson's unique ID (slug)
          href={`/courses/${courseSlug}/lessons/${lesson.id}/${lesson.slug}`}
          className="flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-primary/10 group text-foreground/90 hover:text-primary transition-colors"
          title={lesson.title}
        >
          <BookOpen className="h-5 w-5 text-primary/70 group-hover:text-primary flex-shrink-0" />
          <span className="text-sm font-medium group-hover:font-semibold truncate">
            {lesson.title}
          </span>
        </Link>
      );
    }

    // Case 3: Module or chapter with multiple children (rendered as an AccordionItem)
    return (
      <AccordionItem
        key={node.id} // Module/Chapter's unique ID (slug)
        value={node.id} // Must be unique for accordion state management
        className="border border-border bg-card rounded-lg mb-2 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
      >
        <AccordionTrigger className="py-3 px-4 hover:bg-accent/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background group data-[state=open]:bg-accent/90 data-[state=open]:text-accent-foreground w-full">
          <div className="flex items-center gap-3 flex-1 text-left">
            <FolderKanban className="h-6 w-6 text-primary group-hover:text-primary/90 flex-shrink-0" />
            <span className="font-semibold text-md group-hover:text-primary/90">
              {node.title}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto pl-2">
            <Badge variant="secondary" className="text-xs font-normal h-6">
              {node.children.filter((c) => c.type === "lesson").length} lessons
            </Badge>
            {/* Default chevron from Shadcn/UI will be used here */}
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-3 px-3 bg-background/50">
          <div className="space-y-1.5 pl-4 border-l-2 border-primary/20 ml-3">
            {" "}
            {/* Indentation for children */}
            {node.children.map(renderNode)}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Course Syllabus</CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6 pb-6">
        {structure && structure.length > 0 ? (
          <Accordion
            type="multiple"
            defaultValue={structure
              .filter(
                (n) =>
                  n.type !== "lesson" && n.children && n.children.length > 0
              ) // Only default open non-lesson nodes with children
              .map((n) => n.id)}
            className="w-full space-y-0" // Remove space-y-2, mb-2 on AccordionItem handles it
          >
            {structure.map((node) => renderNode(node))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            The structure for this course has not been defined yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
