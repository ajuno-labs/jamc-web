import { Card, CardContent as UICardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityContentProps {
  content: string
  type: string
  courseId: string
  volumeId: string
  chapterId: string
  moduleId: string
  lessonId: string
  activityId: string
  isEnrolled: boolean
}

export function ActivityContent({
  content,
  type,
  courseId,
  volumeId,
  chapterId,
  moduleId,
  lessonId,
  activityId,
  isEnrolled,
}: ActivityContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Type: {type}</CardTitle>
      </CardHeader>
      <UICardContent>
        <div className="prose dark:prose-invert max-w-none">
          {content}
        </div>
      </UICardContent>
    </Card>
  )
} 