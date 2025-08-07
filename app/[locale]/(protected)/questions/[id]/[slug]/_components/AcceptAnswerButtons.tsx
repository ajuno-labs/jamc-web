"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, GraduationCap, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import {
  acceptAnswerByUser,
  unacceptAnswerByUser,
  acceptAnswerByTeacher,
  unacceptAnswerByTeacher,
} from "../_actions/accept-answer-actions"

interface AcceptAnswerButtonsProps {
  answerId: string
  isAcceptedByUser: boolean
  isAcceptedByTeacher: boolean
  currentUserId?: string
  questionOwnerId: string
  courseTeacherId?: string
  isLinkedToCourse: boolean
}

export function AcceptAnswerButtons({
  answerId,
  isAcceptedByUser,
  isAcceptedByTeacher,
  currentUserId,
  questionOwnerId,
  courseTeacherId,
  isLinkedToCourse,
}: AcceptAnswerButtonsProps) {
  const t = useTranslations("AcceptAnswerButtons")
  const [isLoading, setIsLoading] = useState(false)

  const isQuestionOwner = currentUserId === questionOwnerId
  const isCourseTeacher = currentUserId === courseTeacherId && isLinkedToCourse

  const handleUserAccept = async () => {
    if (!currentUserId) return

    setIsLoading(true)
    try {
      if (isAcceptedByUser) {
        await unacceptAnswerByUser(answerId)
        toast.success(t('userUnaccepted'))
      } else {
        await acceptAnswerByUser(answerId)
        toast.success(t('userAccepted'))
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('updateFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleTeacherAccept = async () => {
    if (!currentUserId) return

    setIsLoading(true)
    try {
      if (isAcceptedByTeacher) {
        await unacceptAnswerByTeacher(answerId)
        toast.success(t('teacherUnaccepted'))
      } else {
        await acceptAnswerByTeacher(answerId)
        toast.success(t('teacherAccepted'))
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('updateFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Acceptance badges */}
      {isAcceptedByUser && (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t('acceptedByAuthor')}
        </Badge>
      )}
      
      {isAcceptedByTeacher && (
        <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
          <GraduationCap className="w-3 h-3 mr-1" />
          {t('acceptedByTeacher')}
        </Badge>
      )}

      {/* Action buttons */}
      {isQuestionOwner && (
        <Button
          variant={isAcceptedByUser ? "outline" : "default"}
          size="sm"
          onClick={handleUserAccept}
          disabled={isLoading}
          className={isAcceptedByUser ? "border-green-200 text-green-700" : ""}
        >
          <User className="w-4 h-4 mr-1" />
          {isAcceptedByUser ? t('unaccept') : t('accept')}
        </Button>
      )}

      {isCourseTeacher && (
        <Button
          variant={isAcceptedByTeacher ? "outline" : "secondary"}
          size="sm"
          onClick={handleTeacherAccept}
          disabled={isLoading}
          className={isAcceptedByTeacher ? "border-blue-200 text-blue-700" : ""}
        >
          <GraduationCap className="w-4 h-4 mr-1" />
          {isAcceptedByTeacher ? t('removeTeacherAcceptance') : t('acceptAsTeacher')}
        </Button>
      )}
    </div>
  )
} 