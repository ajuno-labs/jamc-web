import { redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/user";
import { getLocale } from "next-intl/server";
import { getEnhancedPrisma } from "@/lib/db/enhanced";
import LessonForm from "../../../_components/LessonForm";
import { updateLesson } from "./_actions/lesson-actions";
import type { LessonFormValues } from "../../../_components/LessonForm.types";
interface EditPageProps {
  params: Promise<{
    courseSlug: string;
    lessonId: string;
    lessonSlug: string;
  }>;
}

interface LessonMetadata {
  tags?: string[];
  readingTime?: number;
}

export default async function EditPage({ params }: EditPageProps) {
  const { courseSlug, lessonId, lessonSlug } = await params;
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) {
    notFound();
  }

  const db = await getEnhancedPrisma();
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: {
      id: true,
      modules: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          chapters: { select: { id: true, title: true, slug: true } },
        },
      },
      authorId: true,
    },
  });
  if (!course || course.authorId !== user.id) {
    notFound();
  }

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      chapter: { include: { module: true } },
      files: true,
      course: true,
    },
  });
  if (!lesson) {
    notFound();
  }

  if (lesson.course.slug !== courseSlug || lesson.slug !== lessonSlug) {
    return redirect({
      href: `/courses/${courseSlug}/lessons/${lessonId}/${lesson.slug}/edit`,
      locale,
    });
  }

  if (!lesson.chapter) {
    notFound();
  }

  const metadataObj = lesson.metadata as LessonMetadata;

  const initialValues: LessonFormValues = {
    title: lesson.title,
    summary: lesson.summary ?? "",
    moduleId: lesson.chapter.module.id,
    chapterId: lesson.chapter.id,
    newModuleTitle: "",
    newChapterTitle: "",
  };
  const tagsRaw = metadataObj?.tags;
  const initialTags = Array.isArray(tagsRaw) ? (tagsRaw as string[]).join(",") : "";
  const readingTimeRaw = metadataObj?.readingTime;
  const initialReadingTime = typeof readingTimeRaw === "number" ? readingTimeRaw.toString() : "";

  return (
    <LessonForm
      courseSlug={courseSlug}
      courseId={course.id}
      modules={course.modules}
      initialValues={initialValues}
      initialTags={initialTags}
      initialReadingTime={initialReadingTime}
      onSubmit={updateLesson}
      redirectUrl={`/courses/${courseSlug}/lessons/${lessonId}/${lessonSlug}`}
      lessonId={lessonId}
    />
  );
}
