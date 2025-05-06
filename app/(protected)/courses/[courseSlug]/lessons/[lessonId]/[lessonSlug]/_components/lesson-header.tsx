"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LessonWithCourse } from "@/lib/types/course";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";

interface LessonHeaderProps {
  lesson: LessonWithCourse;
  nextLessonUrl?: string;
  prevLessonUrl?: string;
}

export const LessonHeader = ({
  lesson,
  nextLessonUrl,
  prevLessonUrl,
}: LessonHeaderProps) => {
  return (
    <div className="p-4 flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2">
        <Link href={`/courses/${lesson.courseId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <Heading title={lesson.title} />
        <div className="flex items-center gap-x-2">
          {prevLessonUrl && (
            <Link href={prevLessonUrl}>
              <Button variant="outline" size="sm">
                Previous
              </Button>
            </Link>
          )}
          {nextLessonUrl && (
            <Link href={nextLessonUrl}>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </Link>
          )}
        </div>
      </div>
      {lesson.course?.title && (
        <p className="text-sm text-muted-foreground">
          Course: {lesson.course.title}
        </p>
      )}
    </div>
  );
}; 