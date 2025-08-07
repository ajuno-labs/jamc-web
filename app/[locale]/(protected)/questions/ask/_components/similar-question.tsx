import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SimilarQuestion as SimilarQuestionType } from "../_actions/ask-data";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function SimilarQuestion({ similarQuestions }: { similarQuestions: SimilarQuestionType[] }) {
    const t = useTranslations('AskQuestionPage.QuestionForm.similarQuestions');
    
    return (
        <Card>
            <CardHeader>
              <CardTitle>{t('title')}</CardTitle>
              <CardDescription>
                {t('description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {similarQuestions.map((question: SimilarQuestionType, index: number) => (
                  <li key={index} className="flex items-start justify-between">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <Link href={`/questions/${question.question_id}/${question.slug}`} className="text-primary hover:underline">
                        {question.title}
                      </Link>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {(question.similarity_score * 100).toFixed(0)}% {t('match')}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
        </Card>
    )
}
