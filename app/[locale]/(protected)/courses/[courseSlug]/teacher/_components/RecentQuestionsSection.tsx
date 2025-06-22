'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { QuestionsList } from './QuestionsList'

// Define proper types for tab values
type QuestionTabType = 'all' | 'unanswered' | 'flagged'

interface QuestionVote {
  value: number // 1 for upvote, -1 for downvote
}

interface Question {
  id: string
  content: string
  slug: string
  createdAt: string
  author: { id: string; name: string }
  _count: { answers: number }
  votes?: QuestionVote[] // Add votes to calculate flagged status
}

interface RecentQuestionsSectionProps {
  questions: Question[]
  currentCourseSlug: string
}

// Helper function to calculate vote score and determine if question is flagged
const calculateVoteScore = (votes: QuestionVote[] = []): number => {
  return votes.reduce((total, vote) => total + vote.value, 0)
}

/**
 * Determines if a question should be flagged based on voting patterns.
 * A question is considered flagged if:
 * 1. It has a negative vote score (more downvotes than upvotes)
 * 2. It has at least 2 votes to avoid flagging questions with just one downvote
 * 
 * This helps teachers identify questions that may need attention due to
 * quality issues, inappropriate content, or other concerns raised by the community.
 */
const isQuestionFlagged = (question: Question): boolean => {
  const voteScore = calculateVoteScore(question.votes)
  // Consider a question flagged if it has a negative vote score (more downvotes than upvotes)
  // and has at least 2 votes to avoid flagging questions with just one downvote
  return voteScore < 0 && (question.votes?.length || 0) >= 2
}

export function RecentQuestionsSection({ questions, currentCourseSlug }: RecentQuestionsSectionProps) {
  const [questionTab, setQuestionTab] = useState<QuestionTabType>('all')

  // Calculate counts for each tab
  const unansweredCount = questions.filter(q => q._count.answers === 0).length
  const flaggedCount = questions.filter(q => isQuestionFlagged(q)).length

  const filteredQuestions = questions.filter(q => {
    switch (questionTab) {
      case 'unanswered':
        return q._count.answers === 0
      case 'flagged':
        return isQuestionFlagged(q)
      case 'all':
      default:
        return true
    }
  })

  const handleTabChange = (value: string) => {
    // Type-safe tab change handler
    if (value === 'all' || value === 'unanswered' || value === 'flagged') {
      setQuestionTab(value)
    }
  }

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Questions</CardTitle>
          <CardDescription>Latest student questions from the course</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={questionTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({questions.length})</TabsTrigger>
            <TabsTrigger value="unanswered">
              Unanswered ({unansweredCount})
            </TabsTrigger>
            <TabsTrigger value="flagged">
              Flagged ({flaggedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-4">
          <QuestionsList questions={filteredQuestions} />
        </div>
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