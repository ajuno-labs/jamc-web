"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface Question {
  id: string;
  question: string;
  status: "Answered" | "Unanswered";
  timestamp: string;
  answers: number;
}

interface RecentQuestionsProps {
  questions: Question[];
}

export default function RecentQuestions({ questions }: RecentQuestionsProps) {
  const t = useTranslations("Dashboard.questions");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{q.question}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {q.timestamp}
                  </span>
                  <span>{t("answers", { count: q.answers })}</span>
                </div>
              </div>
              <Badge variant={q.status === "Answered" ? "default" : "secondary"}>
                {q.status === "Answered" ? t("answered") : t("unanswered")}
              </Badge>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          {t("viewAll")}
        </Button>
      </CardContent>
    </Card>
  );
}
