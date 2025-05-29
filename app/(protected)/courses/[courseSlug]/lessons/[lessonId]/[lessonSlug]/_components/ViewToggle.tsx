'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { markLessonViewed, unmarkLessonViewed } from '../_actions/view-actions';
import LessonCompletionDialog from './LessonCompletionDialog';
import QuickReviewDialog from './QuickReviewDialog';

interface ViewToggleProps {
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  initiallyViewed: boolean;
  nextLessonUrl?: string;
}

export default function ViewToggle({ 
  lessonId, 
  lessonTitle,
  courseId,
  initiallyViewed, 
  nextLessonUrl 
}: ViewToggleProps) {
  const [viewed, setViewed] = useState(initiallyViewed);
  const [isPending, startTransition] = useTransition();
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      if (viewed) {
        await unmarkLessonViewed(lessonId);
        setViewed(false);
      } else {
        await markLessonViewed(lessonId);
        setViewed(true);
        setShowCompletionDialog(true);
      }
    });
  };

  const handleReviewBurst = () => {
    setShowCompletionDialog(false);
    setShowReviewDialog(true);
  };

  return (
    <>
      <Button
        type="button"
        variant={viewed ? 'secondary' : 'default'}
        disabled={isPending}
        onClick={handleClick}
      >
        {viewed ? 'Viewed' : 'Mark as Read'}
      </Button>

      <LessonCompletionDialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
        courseId={courseId}
        lessonId={lessonId}
        lessonTitle={lessonTitle}
        nextLessonUrl={nextLessonUrl}
        onReviewBurst={handleReviewBurst}
      />

      <QuickReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        lessonId={lessonId}
        lessonTitle={lessonTitle}
      />
    </>
  );
} 