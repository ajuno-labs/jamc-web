import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookCopy } from "lucide-react"
import { ModuleCardProps } from "@/lib/types/course-structure"

export function ModuleCard({
  id,
  title,
  content,
  slug,
  lessonCount,
  chapterId,
  chapterTitle,
  chapterSlug,
  volumeId,
  volumeTitle,
  volumeSlug,
  courseId,
  courseTitle,
  courseSlug,
}: ModuleCardProps) {
  // Build the URL based on whether this module is part of a chapter or directly under a course
  const moduleUrl = chapterId 
    ? `/courses/${courseId}/${courseSlug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}/modules/${id}/${slug}`
    : `/courses/${courseId}/${courseSlug}/modules/${id}/${slug}`;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link 
            href={moduleUrl}
            className="hover:text-primary transition-colors"
          >
            {title}
          </Link>
        </CardTitle>
        <CardDescription className="flex flex-col">
          <Link 
            href={`/courses/${courseId}/${courseSlug}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {courseTitle}
          </Link>
          {volumeId && (
            <Link 
              href={`/courses/${courseId}/${courseSlug}/volumes/${volumeId}/${volumeSlug}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {volumeTitle}
            </Link>
          )}
          {chapterId && (
            <Link 
              href={`/courses/${courseId}/${courseSlug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {chapterTitle}
            </Link>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">
          {content.length > 150 ? `${content.substring(0, 150)}...` : content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-1 text-muted-foreground">
          <BookCopy className="h-4 w-4" />
          <span>{lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}</span>
        </div>
        <Badge variant="outline">Module</Badge>
      </CardFooter>
    </Card>
  )
} 