"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ModuleQuestion } from "@/lib/types/course"

interface RelatedQuestionsProps {
  questions: ModuleQuestion[]
  moduleId: string
  courseId: string
}

export function RelatedQuestions({ questions, moduleId, courseId }: RelatedQuestionsProps) {
  if (questions.length === 0) {
    return null
  }
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Related Questions</h2>
      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                <Link href={`/questions/${question.id}/${question.slug}`} className="hover:underline">
                  {question.title}
                </Link>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })} by {question.author.name || "Anonymous"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{question._count.answers} answers</span>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Link href={`/questions/ask?moduleId=${moduleId}&courseId=${courseId}`}>
          <Button variant="outline" className="w-full mt-2">Ask a Question About This Module</Button>
        </Link>
      </div>
    </div>
  )
} 