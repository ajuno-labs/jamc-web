import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { CourseQuestion } from "@/lib/types/course"

interface CourseQuestionsProps {
  questions: CourseQuestion[]
}

export default function CourseQuestions({ questions }: CourseQuestionsProps) {
  return (
    <div className="space-y-4">
      {questions.length > 0 ? (
        questions.map((question) => (
          <Card key={question.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                <a href={`/questions/${question.id}/${question.slug}`} className="hover:underline">
                  {question.title}
                </a>
              </CardTitle>
              <CardDescription>
                Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })} by {question.author.name || "Anonymous"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{question._count.answers} answers</span>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No questions related to this course yet.</p>
      )}
    </div>
  )
} 