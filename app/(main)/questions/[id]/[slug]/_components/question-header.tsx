"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Flag } from "lucide-react"
import { voteQuestion } from "../_actions/question-actions"
import { VoteButtons } from "@/components/ui/vote-buttons"

interface QuestionHeaderProps {
  question: {
    id: string
    title: string
    content: string
    author: {
      name: string | null
      image: string | null
    }
    createdAt: Date
    votes: Array<{ value: number, userId?: string }>
    currentUserVote?: number | null
  }
}

export function QuestionHeader({ question }: QuestionHeaderProps) {
  const upvotes = question.votes.filter(v => v.value === 1).length
  const downvotes = question.votes.filter(v => v.value === -1).length

  return (
    <Card className="mb-8">
      <CardHeader>
        <h1 className="text-2xl font-bold">{question.title}</h1>
      </CardHeader>
      <CardContent>
        <p className="text-foreground mb-4">{question.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={question.author.image || undefined} alt={question.author.name || undefined} />
              <AvatarFallback>{question.author.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground">{question.author.name}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(question.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <VoteButtons 
              itemId={question.id}
              upvotes={upvotes}
              downvotes={downvotes}
              userVote={question.currentUserVote}
              onVote={voteQuestion}
              size="md"
            />
            <Button variant="ghost" size="sm">
              <Flag className="mr-1 h-4 w-4" />
              Flag
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 