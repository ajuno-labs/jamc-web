"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { MessageSquare, AlertTriangle } from "lucide-react"
import { voteAnswer } from "../_actions/question-actions"
import { VoteButtons } from "@/components/ui/vote-buttons"
import { useSession } from "next-auth/react"

interface Answer {
  id: string
  content: string
  author: {
    name: string | null
    image: string | null
  }
  createdAt: Date
  votes: Array<{ value: number, userId?: string }>
  isAccepted: boolean
}

interface AnswerListProps {
  answers: Answer[]
  isEducator?: boolean
}

export function AnswerList({ answers, isEducator = false }: AnswerListProps) {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <div className="space-y-6">
      {answers.map((answer) => {
        const upvotes = answer.votes.filter(v => v.value === 1).length
        const downvotes = answer.votes.filter(v => v.value === -1).length
        
        // Determine the current user's vote on this answer
        let currentUserVote = null
        if (user?.id) {
          const userVote = answer.votes.find(vote => vote.userId === user.id)
          if (userVote) {
            currentUserVote = userVote.value
          }
        }

        return (
          <Card key={answer.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={answer.author.image || undefined} alt={answer.author.name || undefined} />
                    <AvatarFallback>{answer.author.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{answer.author.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(answer.createdAt).toLocaleString()}
                  </span>
                </div>
                {isEducator && (
                  <Button variant="ghost" size="sm" className="text-yellow-600">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    Moderate
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{answer.content}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-4">
                <VoteButtons 
                  itemId={answer.id}
                  upvotes={upvotes}
                  downvotes={downvotes}
                  userVote={currentUserVote}
                  onVote={voteAnswer}
                  size="sm"
                />
              </div>
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-1 h-4 w-4" />
                Reply
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
} 