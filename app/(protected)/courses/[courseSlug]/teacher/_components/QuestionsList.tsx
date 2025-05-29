"use client";
import React from "react";
import { Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { MathContent } from "@/components/MathContent";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface QuestionsListProps {
  questions: {
    id: string;
    content: string;
    slug: string;
    createdAt: string;
    author: { id: string; name: string };
    _count: { answers: number };
  }[];
}

export const QuestionsList: React.FC<QuestionsListProps> = ({ questions }) => {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question.id} className="rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{question.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  • {new Date(question.createdAt).toLocaleDateString()}
                </span>
                {question._count.answers === 0 && (
                  <Badge variant="destructive" className="ml-2">
                    Unanswered
                  </Badge>
                )}
              </div>
              <div className="mt-1 text-sm">
                <MathContent content={question.content} />
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{new Date(question.createdAt).toLocaleTimeString()}</span>
                <MessageSquare className="h-3 w-3" />
                <span>{question._count.answers} replies</span>
              </div>
              <div className="mt-2">
                <Button
                  asChild
                  size="sm"
                  variant={
                    question._count.answers === 0 ? "default" : "outline"
                  }
                >
                  <Link href={`/questions/${question.id}`}>
                    {question._count.answers === 0 ? "Answer" : "View"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
