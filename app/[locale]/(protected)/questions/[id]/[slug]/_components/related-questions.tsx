import { Lightbulb } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { RelatedQuestion } from "@/lib/types/question"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Type for related questions, using a subset of the question properties
// (now imported from our centralized type)
// RelatedQuestion = { id: string; title: string; content: string; slug: string }
interface RelatedQuestionsProps {
  questions: RelatedQuestion[]
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