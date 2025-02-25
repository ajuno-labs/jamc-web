"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Flag } from "lucide-react"
import { voteQuestion } from "../_actions/question-actions"
import { useTransition } from "react"
import { toast } from "sonner"

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
    votes: Array<{ value: number }>
  }
}

export function QuestionHeader({ question }: QuestionHeaderProps) {
  const [isPending, startTransition] = useTransition()
  
  const upvotes = question.votes.filter(v => v.value === 1).length
  const downvotes = question.votes.filter(v => v.value === -1).length

  const handleVote = (value: 1 | -1) => {
    startTransition(async () => {
      try {
        await voteQuestion(question.id, value)
      } catch (error) {
        toast.error("You must be logged in to vote")
      }
    })
  }

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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleVote(1)}
              disabled={isPending}
            >
              <ChevronUp className="mr-1 h-4 w-4" />
              {upvotes}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleVote(-1)}
              disabled={isPending}
            >
              <ChevronDown className="mr-1 h-4 w-4" />
              {downvotes}
            </Button>
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