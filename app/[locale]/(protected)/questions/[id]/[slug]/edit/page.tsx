import { redirect } from "@/i18n/navigation"
import { notFound } from "next/navigation"
import { getAuthUser } from "@/lib/auth/get-user"
import { getQuestionWithReputation } from "../_actions/question-edit-actions"
import { EditQuestionForm } from "./_components/EditQuestionForm"
import { getLocale } from "next-intl/server"

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

  const locale = await getLocale()
  
  if (question.slug !== questionSlug) {
    redirect({
      href: `/questions/${questionId}/${question.slug}/edit`,
      locale
    })
  }

  if (!user || user.id !== question.author.id) {
    redirect({
      href: `/questions/${questionId}/${question.slug}`,
      locale
    })
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
