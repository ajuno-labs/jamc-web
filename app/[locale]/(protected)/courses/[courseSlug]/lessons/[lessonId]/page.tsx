import { redirect } from "next/navigation";
import { getLessonAndRedirect } from "../../_components/lesson-actions";

export default async function LessonRedirectPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  const result = await getLessonAndRedirect(lessonId);

  if (!result) {
    redirect(`/courses/${courseSlug}`);
  }

  redirect(
    `/courses/${result.courseSlug}/lessons/${lessonId}/${result.lessonSlug}`
  );
}
