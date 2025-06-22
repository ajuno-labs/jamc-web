import { notFound, redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth/get-user"
import { getQuestionWithReputation } from "../_actions/question-edit-actions"
import { EditQuestionForm } from "./_components/EditQuestionForm"

interface EditQuestionPageProps {
  params: Promise<{ id: string; slug: string }>
}

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  // Await params for Next.js async dynamic APIx
  const { id: questionId, slug: questionSlug } = await params
  
  // Validate params before using them
  if (!questionId || typeof questionId !== 'string') {
    notFound()
  }

  if (!questionSlug || typeof questionSlug !== 'string') {
    notFound()
  }
  
  const [question, user] = await Promise.all([
    getQuestionWithReputation(questionId),
    getAuthUser(),
  ])

  if (!question) {
    notFound()
  }

  // If the slug doesn't match, redirect to the correct URL
  if (question.slug !== questionSlug) {
    redirect(`/questions/${questionId}/${question.slug}/edit`)
  }

  // Check if user is the owner of the question
  if (!user || user.id !== question.author.id) {
    redirect(`/questions/${questionId}/${question.slug}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
        <EditQuestionForm 
          question={question}
          questionId={questionId}
          questionSlug={questionSlug}
        />
      </div>
    </div>
  )
} 