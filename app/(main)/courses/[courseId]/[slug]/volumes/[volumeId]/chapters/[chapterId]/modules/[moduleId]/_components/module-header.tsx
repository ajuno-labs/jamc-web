import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ModuleHeaderProps {
  title: string
  content: string
  courseId: string
  volumeId: string
  chapterId: string
}

export function ModuleHeader({
  title,
  content,
  courseId,
  volumeId,
  chapterId,
}: ModuleHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{content}</CardDescription>
      </CardHeader>
    </Card>
  )
} 