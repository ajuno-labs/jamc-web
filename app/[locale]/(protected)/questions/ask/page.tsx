import { Card } from "@/components/ui/card"
import { QuestionForm } from "./_components/question-form"
import { QuestionContext } from "@/lib/types/question"
import { getTags, getExistingQuestions} from "./_actions/ask-data"
import { getTranslations } from 'next-intl/server'

interface AskQuestionPageProps {
  searchParams: Promise<{ courseId?: string; lessonId?: string }>
}

export default async function AskQuestionPage({ searchParams }: AskQuestionPageProps) {
  const t = await getTranslations('AskQuestionPage')
  const tags = await getTags()
  const existingQuestions = await getExistingQuestions()
  const { courseId, lessonId } = await searchParams

  // Create initial context with courseId and lessonId if provided
  const context: QuestionContext = {}
  if (courseId) {
    context.courseId = courseId
  }
  if (lessonId) {
    context.lessonId = lessonId
  }

  return (
    <div className="container px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <Card className="p-6">
        <QuestionForm
          tags={tags}
          context={context}
          existingQuestions={existingQuestions}
        />
      </Card>
    </div>
  )
} 
