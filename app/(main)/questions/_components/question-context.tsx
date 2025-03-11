"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { CourseStructureType } from "@/lib/types/course-structure"

interface QuestionContextProps {
  courseId?: string
  volumeId?: string
  chapterId?: string
  moduleId?: string
  lessonId?: string
  activityId?: string
  courseTitle?: string
  volumeTitle?: string
  chapterTitle?: string
  moduleTitle?: string
  lessonTitle?: string
  activityTitle?: string
}

export function QuestionContext({
  courseId,
  volumeId,
  chapterId,
  moduleId,
  lessonId,
  activityId,
  courseTitle,
  volumeTitle,
  chapterTitle,
  moduleTitle,
  lessonTitle,
  activityTitle,
}: QuestionContextProps) {
  if (!courseId) {
    return null
  }

  const breadcrumbs = [
    {
      id: courseId,
      title: courseTitle || "Course",
      type: "course" as CourseStructureType,
      href: `/courses/${courseId}`,
    },
    volumeId && {
      id: volumeId,
      title: volumeTitle || "Volume",
      type: "volume" as CourseStructureType,
      href: `/courses/${courseId}/volumes/${volumeId}`,
    },
    chapterId && {
      id: chapterId,
      title: chapterTitle || "Chapter",
      type: "chapter" as CourseStructureType,
      href: `/courses/${courseId}/volumes/${volumeId}/chapters/${chapterId}`,
    },
    moduleId && {
      id: moduleId,
      title: moduleTitle || "Module",
      type: "module" as CourseStructureType,
      href: `/courses/${courseId}/volumes/${volumeId}/chapters/${chapterId}/modules/${moduleId}`,
    },
    lessonId && {
      id: lessonId,
      title: lessonTitle || "Lesson",
      type: "lesson" as CourseStructureType,
      href: `/courses/${courseId}/volumes/${volumeId}/chapters/${chapterId}/modules/${moduleId}/lessons/${lessonId}`,
    },
    activityId && {
      id: activityId,
      title: activityTitle || "Activity",
      type: "activity" as CourseStructureType,
      href: `/courses/${courseId}/volumes/${volumeId}/chapters/${chapterId}/modules/${moduleId}/lessons/${lessonId}/activities/${activityId}`,
    },
  ].filter(Boolean)

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((item, index) => (
          <div key={item.id} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            <Button
              variant="link"
              asChild
              className="h-auto p-0 text-muted-foreground hover:text-primary"
            >
              <Link href={item.href}>{item.title}</Link>
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
} 