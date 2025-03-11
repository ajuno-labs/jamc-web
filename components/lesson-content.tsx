import { Activity } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface LessonContentProps {
  activities: Activity[]
  courseId: string
  volumeId: string
  chapterId: string
  moduleId: string
  lessonId: string
  isEnrolled: boolean
}

export function LessonContent({
  activities,
  courseId,
  volumeId,
  chapterId,
  moduleId,
  lessonId,
  isEnrolled,
}: LessonContentProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader>
            <CardTitle>
              <Link
                href={`/courses/${courseId}/volumes/${volumeId}/chapters/${chapterId}/modules/${moduleId}/lessons/${lessonId}/activities/${activity.id}`}
                className="hover:text-primary transition-colors"
              >
                {activity.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{activity.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 