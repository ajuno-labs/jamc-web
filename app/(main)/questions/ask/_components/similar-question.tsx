import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExistingQuestion } from "../_actions/ask-data";

export default function SimilarQuestion({ similarQuestions }: { similarQuestions: ExistingQuestion[] }) {
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
                {similarQuestions.map((question: ExistingQuestion, index: number) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <a href={`/questions/${question.id}/${question.slug}`} className="text-primary hover:underline">
                      {question.title}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
        </Card>
    )
}