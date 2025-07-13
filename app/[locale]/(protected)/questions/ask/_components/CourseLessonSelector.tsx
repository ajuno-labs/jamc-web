"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { getMyCoursesWithLessons } from "@/lib/actions/course-actions";
import { QuestionContext } from "@/lib/types/question";
import { useTranslations } from "next-intl";

interface EnrolledCourse {
  id: string;
  title: string;
  slug: string;
  lessons: {
    id: string;
    title: string;
    slug: string;
    order: number;
  }[];
}

interface CourseLessonSelectorProps {
  localContext: QuestionContext;
  setLocalContext: (context: QuestionContext) => void;
  context: QuestionContext;
  isSubmitting: boolean;
}

export function CourseLessonSelector({
  localContext,
  setLocalContext,
  context,
  isSubmitting,
}: CourseLessonSelectorProps) {
  const t = useTranslations('AskQuestionPage.QuestionForm');
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingCourses(true);
    getMyCoursesWithLessons()
      .then(setCourses)
      .catch((err: Error) => setCoursesError(err.message))
      .finally(() => setLoadingCourses(false));
  }, []);

  return (
    <div className="space-y-4">
      {/* Course selection */}
      <div className="space-y-2">
        <Label>{t('courseOptional')}</Label>
        {loadingCourses ? (
          <Loader2 className="animate-spin" />
        ) : coursesError ? (
          <p className="text-sm text-destructive">{coursesError}</p>
        ) : (
          <Select
            value={localContext.courseId || ""}
            onValueChange={(value) => {
              // Only reset lessonId if user is manually changing course (not on initial load)
              if (value !== context.courseId) {
                setLocalContext({ courseId: value, lessonId: undefined });
              } else {
                setLocalContext({ courseId: value, lessonId: localContext.lessonId });
              }
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('selectCourse')} />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Lesson selection */}
      {localContext.courseId && (
        <div className="space-y-2">
          <Label>{t('lessonOptional')}</Label>
          <Select
            value={localContext.lessonId || ""}
            onValueChange={(value) =>
              setLocalContext({ ...localContext, lessonId: value })
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('selectLesson')} />
            </SelectTrigger>
            <SelectContent>
              {courses
                .find((c) => c.id === localContext.courseId)
                ?.lessons.map((lesson) => (
                  <SelectItem key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
} 
