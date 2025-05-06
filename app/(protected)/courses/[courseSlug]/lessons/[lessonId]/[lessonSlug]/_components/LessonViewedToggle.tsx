"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  markLessonViewed,
  unmarkLessonViewed,
} from "@/lib/actions/lesson-view-actions";

interface Props {
  lessonId: string;
  initialViewed: boolean;
}

export default function LessonViewedToggle({ lessonId, initialViewed }: Props) {
  const [viewed, setViewed] = useState(initialViewed);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(() => {
      if (!viewed) {
        markLessonViewed(lessonId);
      } else {
        unmarkLessonViewed(lessonId);
      }
      setViewed(!viewed);
    });
  };

  return (
    <Button
      onClick={toggle}
      disabled={pending}
      variant={viewed ? "secondary" : "default"}
    >
      {viewed ? "Unmark as Viewed" : "Mark as Viewed"}
    </Button>
  );
}
