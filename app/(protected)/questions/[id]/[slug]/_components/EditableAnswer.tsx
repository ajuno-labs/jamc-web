"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { UserLink } from "./UserLink"
import { EditButton } from "./EditButton"
import { PreviewToggle } from "./PreviewToggle"
import { CommentSection } from "./CommentSection"
import { AcceptAnswerButtons } from "./AcceptAnswerButtons"
import { updateAnswer } from "../_actions/question-edit-actions"
import { MathContent } from "@/components/MathContent"
import { formatDateTime } from "@/lib/utils/date"

interface Answer {
  id: string
  content: string
  isAcceptedByUser: boolean
  isAcceptedByTeacher: boolean
  questionOwnerId: string
  courseTeacherId?: string
  isLinkedToCourse: boolean
  createdAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
    reputation?: number
  }
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

interface EditableAnswerProps {
  answer: Answer
  currentUserId?: string
  className?: string
}

export function EditableAnswer({ answer, currentUserId, className = "" }: EditableAnswerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [editContent, setEditContent] = useState(answer.content)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOwner = currentUserId === answer.author.id

  const handleSave = async () => {
    if (!editContent.trim()) return

    setIsSubmitting(true)
    try {
      await updateAnswer(answer.id, editContent)
      setIsEditing(false)
      setIsPreview(false)
    } catch (error) {
      console.error("Failed to update answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setEditContent(answer.content)
    setIsEditing(false)
    setIsPreview(false)
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Answer Header */}
        <div className="flex items-center justify-between">
          <UserLink user={answer.author} />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {formatDateTime(answer.createdAt)}
            </span>
            {isOwner && !isEditing && (
              <EditButton onClick={() => setIsEditing(true)} />
            )}
          </div>
        </div>

        {/* Answer Content */}
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Edit Answer</h4>
              <PreviewToggle
                isPreview={isPreview}
                onToggle={() => setIsPreview(!isPreview)}
              />
            </div>
            
            {isPreview ? (
              <Card className="p-4 bg-muted/50">
                <MathContent content={editContent} />
              </Card>
            ) : (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px]"
                placeholder="Write your answer..."
              />
            )}

            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={!editContent.trim() || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            <MathContent content={answer.content} />
          </div>
        )}

        {/* Accept Answer Buttons */}
        {!isEditing && (
          <AcceptAnswerButtons
            answerId={answer.id}
            isAcceptedByUser={answer.isAcceptedByUser}
            isAcceptedByTeacher={answer.isAcceptedByTeacher}
            currentUserId={currentUserId}
            questionOwnerId={answer.questionOwnerId}
            courseTeacherId={answer.courseTeacherId}
            isLinkedToCourse={answer.isLinkedToCourse}
          />
        )}

        {/* Comments Section */}
        {!isEditing && (
          <CommentSection
            comments={answer.comments}
            answerId={answer.id}
            currentUserId={currentUserId}
            className="border-t pt-4"
          />
        )}
      </div>
    </Card>
  )
} 