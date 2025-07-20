import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { getLessonAndRedirect } from "../../_components/lesson-actions";
export default async function LessonRedirectPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  const locale = await getLocale();
  const result = await getLessonAndRedirect(lessonId);

  if (!result) {
    return redirect({ href: `/courses/${courseSlug}`, locale });
  }

  return redirect({ href: `/courses/${result.courseSlug}/lessons/${lessonId}/${result.lessonSlug}`, locale });
}
