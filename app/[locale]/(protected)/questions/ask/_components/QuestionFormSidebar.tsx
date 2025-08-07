"use client";

import { Loader2 } from "lucide-react";
import { SimilarQuestion as SimilarQuestionType } from "../_actions/ask-data";
import SimilarQuestion from "./similar-question";
import PostingGuideline from "./posting-guideline";
import { useTranslations } from "next-intl";

interface QuestionFormSidebarProps {
  isSimilarityLoading: boolean;
  similarityError: string | null;
  similarQuestions: SimilarQuestionType[];
}

export function QuestionFormSidebar({
  isSimilarityLoading,
  similarityError,
  similarQuestions,
}: QuestionFormSidebarProps) {
  const t = useTranslations('AskQuestionPage.QuestionForm');

  return (
    <div>
      {/* Similar Questions Section */}
      <div className="space-y-2">
        {isSimilarityLoading && (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              {t('similarity.loading')}
            </span>
          </div>
        )}
        
        {similarityError && (
          <p className="text-sm text-destructive">{similarityError}</p>
        )}
        
        {similarQuestions.length > 0 && (
          <SimilarQuestion similarQuestions={similarQuestions} />
        )}
      </div>

      {/* Posting Guidelines */}
      <PostingGuideline />
    </div>
  );
} 
