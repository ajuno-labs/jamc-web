'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface LessonNavigationProps {
  previousLessonUrl?: string;
  nextLessonUrl?: string;
}

export default function LessonNavigation({
  previousLessonUrl,
  nextLessonUrl,
}: LessonNavigationProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        {previousLessonUrl ? (
          <Button asChild variant="outline">
            <Link href={previousLessonUrl}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Lesson
            </Link>
          </Button>
        ) : (
          <div /> // Empty div to maintain spacing
        )}
      </div>

      <div>
        {nextLessonUrl ? (
          <Button asChild>
            <Link href={nextLessonUrl}>
              Next Lesson
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        ) : (
          <Button disabled>
            Course Complete
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
} 