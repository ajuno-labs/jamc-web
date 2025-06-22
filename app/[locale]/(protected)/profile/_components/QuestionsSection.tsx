import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import type { ProfileQuestion } from "@/lib/types/profile";

interface QuestionsSectionProps {
  questions: ProfileQuestion[];
  totalQuestions: number;
}

export function QuestionsSection({ questions, totalQuestions }: QuestionsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Questions</CardTitle>
          <CardDescription>Questions you&apos;ve asked</CardDescription>
        </div>
        {totalQuestions > 0 && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile/questions">View All</Link>
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Link
                  href={`/questions/${question.id}/${question.slug}`}
                  className="text-lg font-medium hover:underline"
                >
                  {question.title}
                </Link>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>
                    {formatDistanceToNow(new Date(question.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{question.answerCount} answers</span>
                  <span className="mx-2">•</span>
                  <span>{question.voteCount} votes</span>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">
              You haven&apos;t asked any questions yet.
            </p>
            <Button asChild>
              <Link href="/questions/ask">Ask a Question</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 