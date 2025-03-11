import { Lesson } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ModuleContentProps {
  lessons: Lesson[]
  courseId: string
  volumeId: string
  chapterId: string
  moduleId: string
  isEnrolled: boolean
}

export function ModuleContent({
  lessons,
  courseId,
  volumeId,
  chapterId,
  moduleId,
  isEnrolled,
}: ModuleContentProps) {
  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <Card key={lesson.id}>
          <CardHeader>
            <CardTitle>
              <Link
                href={`/courses/${courseId}/volumes/${volumeId}/chapters/${chapterId}/modules/${moduleId}/lessons/${lesson.id}`}
                className="hover:text-primary transition-colors"
              >
                {lesson.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{lesson.theory}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 