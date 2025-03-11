import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LessonHeaderProps {
  title: string
  courseId: string
  volumeId: string
  chapterId: string
  moduleId: string
}

export function LessonHeader({
  title,
  courseId,
  volumeId,
  chapterId,
  moduleId,
}: LessonHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  )
} 