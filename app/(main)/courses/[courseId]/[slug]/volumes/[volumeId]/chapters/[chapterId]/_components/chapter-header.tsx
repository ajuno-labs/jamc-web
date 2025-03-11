import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChapterHeaderProps {
  title: string
  introduction: string | null
  courseId: string
  volumeId: string
}

export function ChapterHeader({
  title,
  introduction,
  courseId,
  volumeId,
}: ChapterHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {introduction && <CardDescription>{introduction}</CardDescription>}
      </CardHeader>
    </Card>
  )
} 