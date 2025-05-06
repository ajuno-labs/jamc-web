"use client"

import { LessonWithNavigation } from "../_actions/lesson-actions"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface LessonNavigationProps {
  lesson: LessonWithNavigation
}

export function LessonNavigation({ lesson }: LessonNavigationProps) {
  const prevLesson = lesson.course.lessons.find(l => l.order === lesson.order - 1)
  const nextLesson = lesson.course.lessons.find(l => l.order === lesson.order + 1)

  return (
    <div className="flex items-center justify-between">
      {prevLesson ? (
        <Button
          variant="ghost"
          asChild
        >
          <Link
            href={`/courses/${lesson.course.slug}/lessons/${prevLesson.id}/${prevLesson.slug}`}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {prevLesson.title}
          </Link>
        </Button>
      ) : (
        <div />
      )}
      {nextLesson ? (
        <Button
          variant="ghost"
          asChild
        >
          <Link
            href={`/courses/${lesson.course.slug}/lessons/${nextLesson.id}/${nextLesson.slug}`}
          >
            {nextLesson.title}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      ) : (
        <div />
      )}
    </div>
  )
} 