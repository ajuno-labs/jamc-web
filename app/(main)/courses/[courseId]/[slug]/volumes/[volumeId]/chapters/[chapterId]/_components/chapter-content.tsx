import { Module } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ChapterContentProps {
  modules: Module[]
  courseId: string
  volumeId: string
  chapterId: string
  isEnrolled: boolean
}

export function ChapterContent({
  modules,
  courseId,
  volumeId,
  chapterId,
  isEnrolled,
}: ChapterContentProps) {
  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <Card key={module.id}>
          <CardHeader>
            <CardTitle>
              <Link
                href={`/courses/${courseId}/volumes/${volumeId}/chapters/${chapterId}/modules/${module.id}`}
                className="hover:text-primary transition-colors"
              >
                {module.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{module.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 