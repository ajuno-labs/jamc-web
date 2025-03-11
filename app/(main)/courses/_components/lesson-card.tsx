import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { LessonCardProps } from "@/lib/types/course-structure"

export function LessonCard({
  id,
  title,
  slug,
  activityCount,
  moduleId,
  moduleTitle,
  moduleSlug,
  chapterId,
  chapterTitle,
  chapterSlug,
  volumeId,
  volumeTitle,
  volumeSlug,
  courseId,
  courseTitle,
  courseSlug,
}: LessonCardProps) {
  // Build the URL based on the structure
  const lessonUrl = chapterId 
    ? `/courses/${courseId}/${courseSlug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}/modules/${moduleId}/${moduleSlug}/lessons/${id}/${slug}`
    : `/courses/${courseId}/${courseSlug}/modules/${moduleId}/${moduleSlug}/lessons/${id}/${slug}`;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link 
            href={lessonUrl}
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
          <Link 
            href={chapterId 
              ? `/courses/${courseId}/${courseSlug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}/modules/${moduleId}/${moduleSlug}`
              : `/courses/${courseId}/${courseSlug}/modules/${moduleId}/${moduleSlug}`
            }
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {moduleTitle}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">
          This lesson contains theory and examples to help you understand the topic.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-1 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{activityCount} {activityCount === 1 ? "Activity" : "Activities"}</span>
        </div>
        <Badge variant="outline">Lesson</Badge>
      </CardFooter>
    </Card>
  )
} 