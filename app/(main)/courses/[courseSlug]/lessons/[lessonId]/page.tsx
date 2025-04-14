import { redirect } from "next/navigation"
import { getLessonAndRedirect } from "@/app/(main)/courses/[courseSlug]/_components/lesson-actions"

export default async function LessonRedirectPage({
  params,
}: {
  params: { courseSlug: string; lessonId: string }
}) {
  const result = await getLessonAndRedirect(params.lessonId)
  
  if (!result) {
    redirect(`/courses/${params.courseSlug}`)
  }
  
  redirect(`/courses/${result.courseSlug}/lessons/${params.lessonId}/${result.lessonSlug}`)
} 