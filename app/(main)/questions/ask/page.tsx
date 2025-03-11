"use client"

import { Card } from "@/components/ui/card"
import { QuestionForm } from "./_components/question-form"
import { prisma } from "@/lib/db/prisma"

async function getTags() {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          questions: true
        }
      }
    },
    orderBy: {
      questions: {
        _count: 'desc'
      }
    }
  })

  return tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    description: tag.description,
    count: tag._count.questions
  }))
}

export default async function AskQuestionPage() {
  const tags = await getTags()

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Ask a Question</h1>
      <Card className="p-6">
        <AskQuestionForm tags={tags} />
      </Card>
    </div>
  )
}

import { QuestionContextSelector } from "../_components/question-context-selector"
import { useState } from "react"
import { QuestionContext } from "@/lib/types/question"

function AskQuestionForm({ tags }: { tags: any[] }) {
  const [context, setContext] = useState<QuestionContext>({})

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Question Context</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select where this question belongs in the course structure. This helps others find and answer your question.
        </p>
        <QuestionContextSelector onContextChange={setContext} />
      </div>
      <QuestionForm tags={tags} context={context} />
    </div>
  )
} 