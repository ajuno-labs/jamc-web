import { Lightbulb } from "lucide-react"
import Link from "next/link"
import { QuestionWithRelations } from "@/lib/types/prisma"

// Type for related questions, using a subset of the question properties
type RelatedQuestionType = Pick<QuestionWithRelations, "id" | "title" | "content" | "slug">

interface RelatedQuestionsProps {
  questions: RelatedQuestionType[]
}

export function RelatedQuestions({ questions }: RelatedQuestionsProps) {
  return (
    <div className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Related Questions</h2>
      
      {questions.length === 0 ? (
        <p className="text-muted-foreground py-2">No related questions found.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border-b border-border pb-4 last:border-b-0">
              <Link 
                href={`/questions/${question.id}/${question.slug}`} 
                className="text-primary hover:text-primary/80 font-medium"
              >
                {question.title}
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                <Lightbulb className="inline-block mr-1 h-4 w-4 text-yellow-500" />
                {question.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 