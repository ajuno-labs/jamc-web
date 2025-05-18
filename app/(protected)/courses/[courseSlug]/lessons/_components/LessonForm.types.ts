export interface Chapter {
  id: string;
  title: string;
  slug: string;
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  chapters: Chapter[];
}

export type LessonFormValues = {
  title: string;
  summary: string;
  moduleId: string;
  chapterId: string;
  newModuleTitle: string;
  newChapterTitle: string;
};

export interface LessonFormProps {
  courseSlug: string;
  courseId: string;
  modules: Module[];
  initialValues?: LessonFormValues;
  initialTags?: string;
  initialReadingTime?: string;
  initialFiles?: File[];
  onSubmit: (formData: FormData) => Promise<void>;
  redirectUrl: string;
  lessonId?: string;
} 