"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { voteAnswer } from "../_actions/question-actions"
import { VoteButtons } from "@/components/ui/vote-buttons"
import { EditableAnswer } from "./EditableAnswer"

interface Answer {
  id: string
  content: string
  author: {
    id: string
    name: string | null
    image: string | null
    reputation?: number
  }
  createdAt: Date
  votes: Array<{ value: number, userId?: string }>
  isAccepted: boolean
  comments: Array<{
    id: string
    content: string
    createdAt: Date
    author: {
      id: string
      name: string | null
      image: string | null
      reputation?: number
    }
    votes: Array<{
      id: string
      value: number
      userId: string
    }>
  }>
}

interface AnswerListProps {
  answers: Answer[]
  currentUserId?: string
  isEducator?: boolean
}

export function AnswerList({ answers, currentUserId, isEducator = false }: AnswerListProps) {
  return (
    <div className="space-y-6">
      {answers.map((answer) => {
        const upvotes = answer.votes.filter(v => v.value === 1).length
        const downvotes = answer.votes.filter(v => v.value === -1).length
        
        // Determine the current user's vote on this answer
        let currentUserVote = null
        if (currentUserId) {
          const userVote = answer.votes.find(vote => vote.userId === currentUserId)
          if (userVote) {
            currentUserVote = userVote.value
          }
        }

        return (
          <div key={answer.id} className="space-y-4">
            <EditableAnswer 
              answer={answer}
              currentUserId={currentUserId}
            />
            
            <div className="flex items-center justify-between pl-6">
              <VoteButtons 
                itemId={answer.id}
                upvotes={upvotes}
                downvotes={downvotes}
                userVote={currentUserVote}
                onVote={voteAnswer}
                size="sm"
              />
              {isEducator && (
                <Button variant="ghost" size="sm" className="text-yellow-600">
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Moderate
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
} 