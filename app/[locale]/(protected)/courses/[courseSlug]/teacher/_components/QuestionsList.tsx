"use client";
import React from "react";
import { Clock, MessageSquare, AlertTriangle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
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
    votes?: { value: number }[];
  }[];
}

// Helper functions for vote calculations
const calculateVoteScore = (votes: { value: number }[] = []): number => {
  return votes.reduce((total, vote) => total + vote.value, 0)
}

const isQuestionFlagged = (votes: { value: number }[] = []): boolean => {
  const voteScore = calculateVoteScore(votes)
  return voteScore < 0 && votes.length >= 2
}

const getVoteCounts = (votes: { value: number }[] = []) => {
  const upvotes = votes.filter(vote => vote.value > 0).length
  const downvotes = votes.filter(vote => vote.value < 0).length
  return { upvotes, downvotes }
}

export const QuestionsList: React.FC<QuestionsListProps> = ({ questions }) => {
  return (
    <div className="space-y-4">
      {questions.map((question) => {
        const voteScore = calculateVoteScore(question.votes)
        const isFlagged = isQuestionFlagged(question.votes)
        const { upvotes, downvotes } = getVoteCounts(question.votes)
        
        return (
          <div key={question.id} className={`rounded-lg border p-4 ${isFlagged ? 'border-destructive/50 bg-destructive/5' : ''}`}>
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
                  {isFlagged && (
                    <Badge variant="destructive" className="ml-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Flagged
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
                  {question.votes && question.votes.length > 0 && (
                    <>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3 text-green-600" />
                        <span>{upvotes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3 text-red-600" />
                        <span>{downvotes}</span>
                      </div>
                      <span className={`font-medium ${voteScore < 0 ? 'text-red-600' : voteScore > 0 ? 'text-green-600' : ''}`}>
                        Score: {voteScore}
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  <Button
                    asChild
                    size="sm"
                    variant={
                      question._count.answers === 0 || isFlagged ? "default" : "outline"
                    }
                  >
                    <Link href={`/questions/${question.id}`}>
                      {question._count.answers === 0 ? "Answer" : isFlagged ? "Review" : "View"}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
};
