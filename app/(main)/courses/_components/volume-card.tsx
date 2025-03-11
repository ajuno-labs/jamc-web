import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import { VolumeCardProps } from "@/lib/types/course-structure"

export function VolumeCard({
  id,
  title,
  overview,
  slug,
  chapterCount,
  courseId,
  courseTitle,
  courseSlug,
}: VolumeCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link 
            href={`/courses/${courseId}/${courseSlug}/volumes/${id}/${slug}`}
            className="hover:text-primary transition-colors"
          >
            {title}
          </Link>
        </CardTitle>
        <CardDescription>
          <Link 
            href={`/courses/${courseId}/${courseSlug}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {courseTitle}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">
          {overview || "No overview available for this volume."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-1 text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{chapterCount} {chapterCount === 1 ? "Chapter" : "Chapters"}</span>
        </div>
        <Badge variant="outline">Volume</Badge>
      </CardFooter>
    </Card>
  )
} 