import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CourseRelatedQuestionsProps {
  courseId: string
  volumeId: string
  chapterId?: string
  moduleId?: string
  lessonId?: string
  activityId?: string | null
}

export function CourseRelatedQuestions({
  courseId,
  volumeId,
  chapterId,
  moduleId,
  lessonId,
  activityId,
}: CourseRelatedQuestionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Questions</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement related questions functionality */}
        <p className="text-muted-foreground">No related questions yet.</p>
      </CardContent>
    </Card>
  )
}