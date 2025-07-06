import { redirect } from "@/i18n/navigation";
import { getLessonAndRedirect } from "../../_components/lesson-actions";
import { getLocale } from "next-intl/server";

export default async function LessonRedirectPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  const locale = await getLocale();
  const result = await getLessonAndRedirect(lessonId);

  if (!result) {
    redirect({
      href: `/courses/${courseSlug}`,
      locale,
    });
  }

  redirect({
    href: `/courses/${result.courseSlug}/lessons/${lessonId}/${result.lessonSlug}`,
    locale,
  });
}
