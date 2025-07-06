import { getAuthUser } from "@/lib/auth/get-user"
import { QuestionHeader } from "./_components/question-header"
import { AnswerList } from "./_components/answer-list"
import { AnswerForm } from "./_components/answer-form"
import { RelatedQuestions } from "./_components/related-questions"
import { 
  getRelatedQuestions 
} from "./_actions/question-actions"
import {
  getQuestionWithReputation,
  getAnswersWithReputation
} from "./_actions/question-edit-actions"
import { redirect } from "@/i18n/navigation"
import { notFound } from "next/navigation"
import { hasPermission } from "@/lib/types/prisma"

interface QuestionPageProps {
  params: Promise<{ id: string; slug: string }>
}

export default async function QuestionPage({
  params,
}: QuestionPageProps) {
  // Await params for Next.js async dynamic APIs
  const { id: questionId, slug: questionSlug } = await params
  
  // Validate params before using them
  if (!questionId || typeof questionId !== 'string') {
    notFound()
  }

  if (!questionSlug || typeof questionSlug !== 'string') {
    notFound()
  }
  
  const [question, answers, relatedQuestions, user] = await Promise.all([
    getQuestionWithReputation(questionId),
    getAnswersWithReputation(questionId),
    getRelatedQuestions(questionId),
    getAuthUser(),
  ])

  if (!question) {
    notFound()
  }

  // If the slug doesn't match, redirect to the correct URL
  if (question.slug !== questionSlug) {
    return redirect(`/questions/${questionId}/${question.slug}`)
  }

  const isEducator = hasPermission(user, "MANAGE")
  
  // Determine the current user's vote on this question
  let currentUserVote = null
  if (user) {
    const userVote = question.votes.find((vote: { userId?: string; value: number }) => vote.userId === user.id)
    if (userVote) {
      currentUserVote = userVote.value
    }
  }
  
  // Enhance question with current user's vote and normalize nulls to undefined for optional props
  const enhancedQuestion = {
    ...question,
    currentUserVote,
    course: question.course ?? undefined,
    lesson: question.lesson ?? undefined,
    slug: question.slug,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-8">
          <QuestionHeader 
            question={enhancedQuestion} 
            currentUserId={user?.id}
          />
          <AnswerList 
            answers={answers} 
            currentUserId={user?.id}
            isEducator={isEducator} 
          />
          <AnswerForm questionId={questionId} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <RelatedQuestions questions={relatedQuestions} />
        </aside>
      </div>
    </div>
  )
}
