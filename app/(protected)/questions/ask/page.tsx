import { Card } from "@/components/ui/card"
import { QuestionForm } from "./_components/question-form"
import { QuestionContext } from "@/lib/types/question"
import { getTags, getExistingQuestions} from "./_actions/ask-data"

interface AskQuestionPageProps {
  searchParams: Promise<{ courseId?: string }>
}

export default async function AskQuestionPage({ searchParams }: AskQuestionPageProps) {
  const tags = await getTags()
  const existingQuestions = await getExistingQuestions()
  const { courseId } = await searchParams

  // Create initial context with courseId if provided
  const context: QuestionContext = {}
  if (courseId) {
    context.courseId = courseId
  }

  return (
    <div className="container px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Ask a Question</h1>
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