"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { voteAnswer } from "../_actions/question-actions"
import { VoteButtons } from "@/components/ui/vote-buttons"
import { EditableAnswer } from "./EditableAnswer"
import { useTranslations } from "next-intl"

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
  isAcceptedByUser: boolean
  isAcceptedByTeacher: boolean
  questionOwnerId: string
  courseTeacherId?: string
  isLinkedToCourse: boolean
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
  const t = useTranslations("AnswerList")
  return (
    <div className="space-y-4 sm:space-y-6">
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
          <div key={answer.id} className="space-y-3 sm:space-y-4">
            <EditableAnswer 
              answer={answer}
              currentUserId={currentUserId}
            />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pl-3 sm:pl-6 gap-2 sm:gap-0">
              <VoteButtons 
                itemId={answer.id}
                upvotes={upvotes}
                downvotes={downvotes}
                userVote={currentUserVote}
                onVote={voteAnswer}
                size="sm"
              />
              {isEducator && (
                <Button variant="ghost" size="sm" className="text-yellow-600 w-fit">
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">{t('moderate')}</span>
                  <span className="sm:hidden">{t('mod')}</span>
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
