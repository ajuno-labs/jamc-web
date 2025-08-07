"use client"

import { useState } from "react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp } from "lucide-react"
import { addComment, voteComment } from "../_actions/question-edit-actions"
import { MathContent } from "@/components/MathContent"
import { ClientDate } from "@/components/client-date"
import { useTranslations } from "next-intl"

interface Comment {
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
}

interface CommentSectionProps {
  comments: Comment[]
  questionId?: string
  answerId?: string
  currentUserId?: string
  className?: string
}

export function CommentSection({ comments, questionId, answerId, currentUserId, className = "" }: CommentSectionProps) {
  const t = useTranslations("CommentSection")
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(newComment, questionId, answerId)
      setNewComment("")
      setIsAddingComment(false)
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVoteComment = async (commentId: string, value: number) => {
    try {
      await voteComment(commentId, value)
    } catch (error) {
      console.error("Failed to vote on comment:", error)
    }
  }

  return (
    <div className={`${className}`}>
      {comments.length > 0 && (
        <div className="border-t pt-2 space-y-1">
          {comments.map((comment) => {
            const upvotes = comment.votes.filter(v => v.value === 1).length
            const userVote = currentUserId ? comment.votes.find(v => v.userId === currentUserId) : null
            const hasUpvoted = userVote?.value === 1

            return (
              <div key={comment.id} className="flex items-start gap-2 py-1 text-sm">
                {/* Vote button */}
                <button
                  onClick={() => handleVoteComment(comment.id, 1)}
                  className={`flex items-center gap-1 px-1 py-0.5 rounded text-xs transition-colors ${
                    hasUpvoted 
                      ? 'text-orange-600 bg-orange-50 hover:bg-orange-100' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  disabled={!currentUserId}
                >
                  <ThumbsUp className="h-3 w-3" />
                  {upvotes > 0 && <span>{upvotes}</span>}
                </button>

                {/* Comment content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground">
                    <MathContent content={comment.content} />
                  </div>
                  
                  {/* Comment metadata */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Link 
                      href={`/profile/${comment.author.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {comment.author.name}
                    </Link>
                    <span><ClientDate date={comment.createdAt} /></span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add comment section */}
      <div className="mt-2">
        {isAddingComment ? (
          <div className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('placeholder')}
              className="min-h-[60px] text-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
                className="text-xs"
              >
                {isSubmitting ? t('adding') : t('addComment')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAddingComment(false)
                  setNewComment("")
                }}
                size="sm"
                className="text-xs"
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingComment(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            disabled={!currentUserId}
          >
            {t('addCommentLink')}
          </button>
        )}
      </div>
    </div>
  )
} 
