import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ChevronRight, CheckCircle, Clock, Layers, Menu } from "lucide-react";
import type { Lesson } from "@prisma/client";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StructureItem {
  id: string;
  title: string;
  children?: StructureItem[];
}

interface CourseContentProps {
  courseSlug: string;
  lessons: (Lesson & {
    displayInfo?: {
      title: string;
      parent?: {
        title: string;
      };
    } | null;
    completed?: boolean;
  })[];
  structure: StructureItem[] | null;
  currentLessonId?: string;
}

export function CourseContent({
  courseSlug,
  lessons,
  structure,
  currentLessonId,
}: CourseContentProps) {
  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const progressPercentage =
    lessons.length > 0
      ? Math.round((completedLessons / lessons.length) * 100)
      : 0;

  // Count lessons purely from the structure: leaf nodes count as 1
  function countLessons(node: StructureItem): number {
    if (!node.children?.length) return 1;
    return node.children.reduce((sum, child) => sum + countLessons(child), 0);
  }

  // Map of lesson ID to lesson object for quick lookup
  const lessonMap = new Map<string, (typeof lessons)[number]>(
    lessons.map((l) => [l.id, l])
  );

  // Render any structure nodes as an accordion, with lessons at leaves
  const renderStructure = (nodes: StructureItem[]) => (
    <Accordion type="multiple" className="space-y-3">
      {nodes.map((node) => {
        const total = countLessons(node);
        return (
          <AccordionItem
            key={node.id}
            value={node.id}
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="flex justify-between px-4 py-3 bg-card hover:bg-accent/30">
              <span>{node.title}</span>
              <Badge variant="outline" className="text-xs">
                {total} {total === 1 ? "lesson" : "lessons"}
              </Badge>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              {node.children && node.children.length > 0
                ? // Recurse into nested structure
                  renderStructure(node.children)
                : // Leaf: show lesson link
                  (() => {
                    const lesson = lessonMap.get(node.id);
                    if (!lesson) return null;
                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseSlug}/lessons/${lesson.id}/${lesson.slug}`}
                        className="block px-4 py-2 hover:bg-muted/50"
                      >
                        {lesson.title}
                      </Link>
                    );
                  })()}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );

  const renderFlatList = () => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {lessons.map((lesson) => (
        <Card
          key={lesson.id}
          className={cn(
            "hover:shadow-md transition-all duration-200 h-full",
            currentLessonId === lesson.id && "ring-2 ring-primary/50"
          )}
        >
          <CardHeader className="p-4 pb-2">
            {lesson.displayInfo?.parent && (
              <CardDescription className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                {lesson.displayInfo.parent.title}
              </CardDescription>
            )}
            <CardTitle className="text-lg">{lesson.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 pb-0">
            {lesson.displayInfo?.title &&
              lesson.displayInfo.title !== lesson.title && (
                <p className="text-sm text-muted-foreground">
                  {lesson.displayInfo.title}
                </p>
              )}
          </CardContent>
          <CardFooter className="p-4 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {lesson.completed ? (
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-600 border-green-200"
                >
                  <CheckCircle className="mr-1 h-3 w-3" /> Completed
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-600 border-blue-200"
                >
                  <Clock className="mr-1 h-3 w-3" /> In progress
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary gap-1 font-medium"
              asChild
            >
              <Link
                href={`/courses/${courseSlug}/lessons/${lesson.id}/${lesson.slug}`}
              >
                View <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const hasStructure = Array.isArray(structure) && structure.length > 0;
  const content = hasStructure ? renderStructure(structure!) : renderFlatList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Course Content</h2>
          <p className="text-muted-foreground mt-1">
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} in
            this course
          </p>
        </div>
        {progressPercentage > 0 && (
          <div className="w-full sm:w-48 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your progress</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </div>
      <Sheet>
        <SheetTrigger asChild className="lg:hidden mb-4">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Menu className="h-4 w-4" />
            View Course Syllabus
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-full max-w-md p-0 overflow-y-auto"
        >
          <SheetHeader className="px-4 pt-4 pb-2 sticky top-0 bg-background z-10 border-b">
            <SheetTitle className="flex items-center justify-between">
              Course Content
            </SheetTitle>
            {progressPercentage > 0 && (
              <div className="w-full space-y-1 mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Your progress</span>
                  <span className="font-medium">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}
          </SheetHeader>
          <div className="p-4 space-y-4">{content}</div>
          <SheetClose asChild>
            <Button variant="ghost" size="sm" className="m-4 w-full">
              Done
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
      <div className="hidden lg:block space-y-4">{content}</div>
    </div>
  );
}
