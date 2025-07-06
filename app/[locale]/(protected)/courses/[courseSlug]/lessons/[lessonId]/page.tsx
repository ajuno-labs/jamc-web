import { redirect } from "@/i18n/navigation";
import { getLessonAndRedirect } from "../../_components/lesson-actions";
export default async function LessonRedirectPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  const result = await getLessonAndRedirect(lessonId);

  if (!result) {
    return redirect(`/courses/${courseSlug}`);
  }

  return redirect(`/courses/${result.courseSlug}/lessons/${lessonId}/${result.lessonSlug}`);
}
