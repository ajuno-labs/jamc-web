'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { markLessonViewed, unmarkLessonViewed } from '../_actions/view-actions';

interface ViewToggleProps {
  lessonId: string;
  initiallyViewed: boolean;
}

export default function ViewToggle({ lessonId, initiallyViewed }: ViewToggleProps) {
  const [viewed, setViewed] = useState(initiallyViewed);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      if (viewed) {
        await unmarkLessonViewed(lessonId);
        setViewed(false);
      } else {
        await markLessonViewed(lessonId);
        setViewed(true);
      }
    });
  };

  return (
    <Button
      type="button"
      variant={viewed ? 'secondary' : 'default'}
      disabled={isPending}
      onClick={handleClick}
    >
      {viewed ? 'Viewed' : 'Mark as Viewed'}
    </Button>
  );
} 