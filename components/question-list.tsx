import Link from "next/link"
import { Question } from "@prisma/client"

interface QuestionListProps {
  questions: Question[]
}

export function QuestionList({ questions }: QuestionListProps) {
  if (questions.length === 0) {
    return <p className="text-muted-foreground">No questions yet.</p>
  }

  return (
    <ul className="space-y-4">
      {questions.map((question) => (
        <li key={question.id}>
          <Link
            href={`/questions/${question.id}/${question.slug}`}
            className="block hover:bg-muted p-2 rounded-md transition-colors"
          >
            <h3 className="font-medium">{question.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {question.content}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
} 