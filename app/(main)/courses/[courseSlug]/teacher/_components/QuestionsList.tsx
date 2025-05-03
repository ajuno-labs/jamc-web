"use client"
import React from "react"
import { Clock, MessageSquare } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface QuestionsListProps {
  questions: {
    id: string
    content: string
    slug: string
    createdAt: string
    author: { id: string; name: string }
    _count: { answers: number }
  }[]
}

export const QuestionsList: React.FC<QuestionsListProps> = ({ questions }) => {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question.id} className="flex items-start gap-4 rounded-lg border p-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{question.author.name}</span>
              <span className="text-xs text-muted-foreground">• {new Date(question.createdAt).toLocaleDateString()}</span>
              {question._count.answers === 0 && (
                <Badge variant="destructive" className="ml-auto">
                  Unanswered
                </Badge>
              )}
            </div>
            <p className="text-sm">{question.content}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(question.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{question._count.answers} replies</span>
              </div>
            </div>
          </div>
          <Button size="sm" variant={question._count.answers === 0 ? "default" : "outline"}>
            {question._count.answers === 0 ? "Answer" : "View"}
          </Button>
        </div>
      ))}
    </div>
  )
}
