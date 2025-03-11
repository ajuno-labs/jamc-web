import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityHeaderProps {
  title: string
  courseId: string
  volumeId: string
  chapterId: string
  moduleId: string
  lessonId: string
}

export function ActivityHeader({
  title,
  courseId,
  volumeId,
  chapterId,
  moduleId,
  lessonId,
}: ActivityHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  )
} 