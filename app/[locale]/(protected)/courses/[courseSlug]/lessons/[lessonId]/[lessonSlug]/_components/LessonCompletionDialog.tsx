'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageSquare, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface LessonCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  nextLessonUrl?: string;
  onReviewBurst: () => void;
}

export default function LessonCompletionDialog({
  open,
  onOpenChange,
  courseId,
  lessonId,
  lessonTitle,
  nextLessonUrl,
  onReviewBurst,
}: LessonCompletionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl">Lesson Completed!</DialogTitle>
          <p className="text-muted-foreground">
            Great job completing &quot;{lessonTitle}&quot;. Keep up the momentum!
          </p>
        </DialogHeader>

        <div className="space-y-3 mt-6">
          {nextLessonUrl && (
            <Button asChild className="w-full" size="lg">
              <Link href={nextLessonUrl}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue to Next Lesson
              </Link>
            </Button>
          )}

          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={onReviewBurst}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Quick Review
          </Button>

          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href={`/questions/ask?courseId=${courseId}&lessonId=${lessonId}`}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask a Question
            </Link>
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 