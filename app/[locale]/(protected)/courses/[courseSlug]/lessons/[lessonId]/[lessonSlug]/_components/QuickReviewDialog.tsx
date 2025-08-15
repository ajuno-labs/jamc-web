'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { getReviewQuestions }  from '../_actions/review-actions'
import { MathContent } from '@/components/MathContent';
import type { QuestionReview } from '@/lib/db/query-args';

interface QuickReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
  lessonTitle: string;
}

export default function QuickReviewDialog({
  open,
  onOpenChange,
  lessonId,
  lessonTitle,
}: QuickReviewDialogProps) {
  const [questions, setQuestions] = useState<QuestionReview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getReviewQuestions(lessonId)
        .then(setQuestions)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, lessonId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <DialogTitle className="text-xl">Quick Review: {lessonTitle}</DialogTitle>
          </div>
          <p className="text-muted-foreground">
            Take a moment to reflect on these questions from this lesson. This helps reinforce your learning!
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Questions Yet</h3>
                <p className="text-muted-foreground">
                  There are no questions for this lesson yet. Why not be the first to ask one?
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Here are {questions.length} question{questions.length !== 1 ? 's' : ''} to think about:
              </p>
              {questions.map((question, index) => (
                <Card key={question.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">{question.title}</h4>
                        <div className="text-muted-foreground">
                          <MathContent content={question.content || ""} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Done Reflecting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 