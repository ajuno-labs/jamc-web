'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { QuestionsList } from './QuestionsList'

interface Question {
  id: string
  content: string
  slug: string
  createdAt: string
  author: { id: string; name: string }
  _count: { answers: number }
}

interface RecentQuestionsSectionProps {
  questions: Question[]
  currentCourseSlug: string
}

export function RecentQuestionsSection({ questions, currentCourseSlug }: RecentQuestionsSectionProps) {
  const [questionTab, setQuestionTab] = useState<'all' | 'unanswered' | 'flagged'>('all')

  const filteredQuestions = questions.filter(q => {
    if (questionTab === 'unanswered') return q._count.answers === 0
    if (questionTab === 'flagged') return q._count.answers > 0
    return true
  })

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Questions</CardTitle>
          <CardDescription>Latest student questions from the course</CardDescription>
        </div>
        <Tabs value={questionTab} onValueChange={value => setQuestionTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <QuestionsList questions={filteredQuestions} />
      </CardContent>
      <CardFooter>
        <Link href={`/courses/${currentCourseSlug}/teacher/questions`} className="w-full">
          <Button variant="outline" className="w-full">
            View All Questions
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
} 