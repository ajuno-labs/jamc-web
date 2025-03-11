import { Chapter } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface VolumeContentProps {
  chapters: Chapter[]
  courseId: string
  volumeId: string
  isEnrolled: boolean
}

export function VolumeContent({
  chapters,
  courseId,
  volumeId,
  isEnrolled,
}: VolumeContentProps) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <Card key={chapter.id}>
          <CardHeader>
            <CardTitle>
              <Link
                href={`/courses/${courseId}/volumes/${volumeId}/chapters/${chapter.id}`}
                className="hover:text-primary transition-colors"
              >
                {chapter.title}
              </Link>
            </CardTitle>
          </CardHeader>
          {chapter.introduction && (
            <CardContent>
              <p className="text-muted-foreground">{chapter.introduction}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
} 