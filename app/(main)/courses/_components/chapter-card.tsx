import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookText } from "lucide-react"
import { ChapterCardProps } from "@/lib/types/course-structure"

export function ChapterCard({
  id,
  title,
  introduction,
  slug,
  moduleCount,
  volumeId,
  volumeTitle,
  volumeSlug,
  courseId,
  courseTitle,
  courseSlug,
}: ChapterCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link 
            href={`/courses/${courseId}/${courseSlug}/volumes/${volumeId}/${volumeSlug}/chapters/${id}/${slug}`}
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
          <Link 
            href={`/courses/${courseId}/${courseSlug}/volumes/${volumeId}/${volumeSlug}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {volumeTitle}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">
          {introduction || "No introduction available for this chapter."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-1 text-muted-foreground">
          <BookText className="h-4 w-4" />
          <span>{moduleCount} {moduleCount === 1 ? "Module" : "Modules"}</span>
        </div>
        <Badge variant="outline">Chapter</Badge>
      </CardFooter>
    </Card>
  )
} 