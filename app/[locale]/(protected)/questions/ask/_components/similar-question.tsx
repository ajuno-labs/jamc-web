import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SimilarQuestion as SimilarQuestionType } from "../_actions/ask-data";

export default function SimilarQuestion({ similarQuestions }: { similarQuestions: SimilarQuestionType[] }) {
    return (
        <Card>
            <CardHeader>
              <CardTitle>Similar Questions</CardTitle>
              <CardDescription>
                These questions might be related to yours. Check them out before posting!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {similarQuestions.map((question: SimilarQuestionType, index: number) => (
                  <li key={index} className="flex items-start justify-between">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <a href={`/questions/${question.question_id}`} className="text-primary hover:underline">
                        {question.title}
                      </a>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {(question.similarity_score * 100).toFixed(0)}% match
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
        </Card>
    )
}
