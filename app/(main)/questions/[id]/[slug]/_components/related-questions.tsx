import { Lightbulb } from "lucide-react"
import Link from "next/link"
import { QuestionWithRelations } from "@/lib/types/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Type for related questions, using a subset of the question properties
type RelatedQuestionType = Pick<QuestionWithRelations, "id" | "title" | "content" | "slug">

interface RelatedQuestionsProps {
  questions: RelatedQuestionType[]
}

export function RelatedQuestions({ questions }: RelatedQuestionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Questions</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <Lightbulb className="inline-block mr-1 h-4 w-4 text-amber-500" />
                  {question.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 