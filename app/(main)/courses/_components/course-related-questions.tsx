"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { RelatedQuestions } from "@/app/(main)/questions/[id]/[slug]/_components/related-questions"
import { useEffect, useState } from "react"
import { getRelatedQuestions } from "@/app/(main)/courses/_actions/course-structure-actions"
import { QuestionList } from "@/components/question-list"

type RelatedQuestion = {
  id: string
  title: string
  content: string
  slug: string
}

interface CourseRelatedQuestionsProps {
  courseId: string
  volumeId?: string
  chapterId?: string
  moduleId?: string
  lessonId?: string
  activityId?: string
}

export async function CourseRelatedQuestions({
  courseId,
  volumeId,
  chapterId,
  moduleId,
  lessonId,
  activityId,
}: CourseRelatedQuestionsProps) {
  const questions = await getRelatedQuestions({
    courseId,
    volumeId,
    chapterId,
    moduleId,
    lessonId,
    activityId,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <QuestionList questions={questions} />
      </CardContent>
    </Card>
  )
} 