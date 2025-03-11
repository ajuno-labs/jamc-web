"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { RelatedQuestions } from "@/app/(main)/questions/[id]/[slug]/_components/related-questions"
import { useEffect, useState } from "react"
import { getRelatedQuestions } from "@/app/(main)/courses/_actions/course-structure-actions"

type RelatedQuestion = {
  id: string
  title: string
  content: string
  slug: string
}

interface CourseRelatedQuestionsProps {
  courseId?: string
  volumeId?: string
  chapterId?: string
  moduleId?: string
  lessonId?: string
  activityId?: string
}

export function CourseRelatedQuestions({
  courseId,
  volumeId,
  chapterId,
  moduleId,
  lessonId,
  activityId,
}: CourseRelatedQuestionsProps) {
  const [questions, setQuestions] = useState<RelatedQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        const data = await getRelatedQuestions({
          courseId,
          volumeId,
          chapterId,
          moduleId,
          lessonId,
          activityId,
          limit: 3
        })
        // Transform the data to match the RelatedQuestion type
        const transformedQuestions = data.map(q => ({
          id: q.id,
          title: q.title,
          content: q.content,
          slug: q.slug || q.id // Fallback to id if slug is not available
        }))
        setQuestions(transformedQuestions)
      } catch (error) {
        console.error("Failed to load related questions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [courseId, volumeId, chapterId, moduleId, lessonId, activityId])

  const context = {
    courseId,
    volumeId,
    chapterId,
    moduleId,
    lessonId,
    activityId,
  }

  const queryParams = new URLSearchParams(
    Object.entries(context)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, value as string])
  ).toString()

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Related Questions</h2>
        <Button asChild size="sm">
          <Link href={`/questions/ask?${queryParams}`}>
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Link>
        </Button>
      </div>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      ) : (
        <RelatedQuestions questions={questions} />
      )}
    </Card>
  )
} 