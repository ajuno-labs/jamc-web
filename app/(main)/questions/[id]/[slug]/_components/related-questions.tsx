import { Lightbulb } from "lucide-react"
import Link from "next/link"

interface RelatedQuestion {
  id: string
  title: string
  content: string
}

interface RelatedQuestionsProps {
  questions: RelatedQuestion[]
}

export function RelatedQuestions({ questions }: RelatedQuestionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Related Questions</h2>
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <Link 
              href={`/question/${question.id}`} 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {question.title}
            </Link>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              <Lightbulb className="inline-block mr-1 h-4 w-4 text-yellow-500" />
              {question.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 