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