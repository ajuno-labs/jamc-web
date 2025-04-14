"use client"

import { LessonWithCourse } from "../_actions/lesson-actions"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

interface LessonContentProps {
  lesson: LessonWithCourse
}

export function LessonContent({ lesson }: LessonContentProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.theory }} />
            {lesson.examples && (
              <>
                <h2>Examples</h2>
                <div dangerouslySetInnerHTML={{ __html: lesson.examples }} />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 