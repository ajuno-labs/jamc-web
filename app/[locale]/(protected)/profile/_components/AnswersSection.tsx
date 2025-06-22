import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import type { ProfileAnswer } from "@/lib/types/profile";

interface AnswersSectionProps {
  answers: ProfileAnswer[];
  totalAnswers: number;
}

export function AnswersSection({ answers, totalAnswers }: AnswersSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Answers</CardTitle>
          <CardDescription>Answers you&apos;ve provided</CardDescription>
        </div>
        {totalAnswers > 0 && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile/answers">View All</Link>
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {answers.length > 0 ? (
          <div className="space-y-4">
            {answers.map((answer) => (
              <div key={answer.id} className="space-y-2">
                <div>
                  <Link
                    href={`/questions/${answer.questionId}/${answer.questionSlug}`}
                    className="text-lg font-medium hover:underline"
                  >
                    {answer.questionTitle}
                  </Link>
                  {answer.isAccepted && (
                    <Badge className="ml-2" variant="default">
                      Accepted
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {answer.content}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>
                    {formatDistanceToNow(new Date(answer.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">
              You haven&apos;t answered any questions yet.
            </p>
            <Button variant="outline" asChild>
              <Link href="/questions">Browse Questions</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 