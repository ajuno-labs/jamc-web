import { Link } from "@/i18n/navigation";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LessonSummary } from "../_actions/summary-actions";

interface RelatedQuestionsProps {
  questions: LessonSummary["questions"];
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function RelatedQuestions({ questions }: RelatedQuestionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Related Questions
        </h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/questions/ask">Ask a Question</Link>
        </Button>
      </div>
      <div className="space-y-3">
        {questions.map((question: LessonSummary["questions"][0]) => (
          <Card key={question.id} className="hover:bg-accent/50 transition-colors">
            <Link href={`/questions/${question.id}`} className="block">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{question.title}</CardTitle>
              </CardHeader>
              <CardFooter className="pt-0 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={question.author.image || "/placeholder.svg"}
                      alt={question.author.name ?? ""}
                    />
                    <AvatarFallback>
                      {question.author.name ? question.author.name.charAt(0) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{question.author.name ?? "Unknown"}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(question.createdAt.toString())}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {question._count.votes} votes
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {question._count.answers} answers
                  </Badge>
                </div>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="ghost" size="sm">
          View All Questions
        </Button>
      </div>
    </div>
  );
} 