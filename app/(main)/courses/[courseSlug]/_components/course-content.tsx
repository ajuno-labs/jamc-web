import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { Lesson } from "@prisma/client"

interface CourseContentProps {
  courseSlug: string
  lessons: (Lesson & {
    displayInfo?: {
      title: string
      parent?: {
        title: string
      }
    } | null
  })[]
}

export function CourseContent({ courseSlug, lessons }: CourseContentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">Course Content</h2>
      {lessons.map((lesson) => (
        <Card key={lesson.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              {lesson.displayInfo && (
                <div className="text-sm text-muted-foreground mb-1">
                  {lesson.displayInfo.parent ? `${lesson.displayInfo.parent.title} › ` : ''}
                  {lesson.displayInfo.title}
                </div>
              )}
              <h3 className="font-medium">{lesson.title}</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              asChild
            >
              <Link href={`/courses/${courseSlug}/lessons/${lesson.id}/${lesson.slug}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
} 