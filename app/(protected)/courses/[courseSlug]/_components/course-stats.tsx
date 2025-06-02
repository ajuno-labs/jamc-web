import { Card } from "@/components/ui/card"
import { BookOpen, Clock, Users } from "lucide-react"

interface CourseStatsProps {
  lessonCount: number
  studentCount: number
  updatedAt: Date
}

export function CourseStats({ lessonCount, studentCount, updatedAt }: CourseStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span>{lessonCount} Lessons</span>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>{studentCount} Students</span>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>Updated {new Date(updatedAt).toLocaleDateString()}</span>
        </div>
      </Card>
    </div>
  )
} 