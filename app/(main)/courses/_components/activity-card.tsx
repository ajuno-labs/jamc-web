import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool } from "lucide-react"
import { ActivityCardProps } from "@/lib/types/course-structure"

export function ActivityCard({
  id,
  title,
  slug,
  lessonId,
  lessonTitle,
  lessonSlug,
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
}: ActivityCardProps) {
  // Build the URL based on the structure
  const activityUrl = chapterId 
    ? `/courses/${courseId}/${courseSlug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}/modules/${moduleId}/${moduleSlug}/lessons/${lessonId}/${lessonSlug}/activities/${id}/${slug}`
    : `/courses/${courseId}/${courseSlug}/modules/${moduleId}/${moduleSlug}/lessons/${lessonId}/${lessonSlug}/activities/${id}/${slug}`;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link 
            href={activityUrl}
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
          <Link 
            href={chapterId 
              ? `/courses/${courseId}/${courseSlug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}/modules/${moduleId}/${moduleSlug}/lessons/${lessonId}/${lessonSlug}`
              : `/courses/${courseId}/${courseSlug}/modules/${moduleId}/${moduleSlug}/lessons/${lessonId}/${lessonSlug}`
            }
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {lessonTitle}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">
          Practice what you've learned with this activity.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-1 text-muted-foreground">
          <PenTool className="h-4 w-4" />
          <span>Practice Activity</span>
        </div>
        <Badge variant="outline">Activity</Badge>
      </CardFooter>
    </Card>
  )
} 