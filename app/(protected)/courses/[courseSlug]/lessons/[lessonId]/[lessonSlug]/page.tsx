import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getLessonSummary } from "./_actions/summary-actions";
import { getAuthUser } from "@/lib/auth/get-user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEnhancedPrisma } from "@/lib/db/enhanced";
import ViewToggle from "./_components/ViewToggle";

import LessonSummaryHeader from "./_components/LessonSummaryHeader";
import LessonSummary from "./_components/LessonSummary";
import RelatedQuestions from "./_components/RelatedQuestions";
import LessonResources from "./_components/LessonResources";
import QuickActions from "./_components/QuickActions";

export default async function LessonSummaryPage({ params }: { params: { courseSlug: string; lessonId: string; lessonSlug: string } }) {
  const { courseSlug, lessonId, lessonSlug } = params;

  const lesson = await getLessonSummary(lessonId);
  if (!lesson) {
    notFound();
  }

  if (lesson.course.slug !== courseSlug || lesson.slug !== lessonSlug) {
    return redirect(`/courses/${lesson.course.slug}/lessons/${lessonId}/${lesson.slug}`);
  }

  const user = await getAuthUser();
  const db = await getEnhancedPrisma();
  const viewRecord = user
    ? await db.lessonView.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId } },
      })
    : null;
  const viewed = Boolean(viewRecord);

  const hasAccess = Boolean(
    user &&
      (lesson.course.author.id === user.id ||
        lesson.course.enrollments.some((e) => e.userId === user.id))
  );

  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Enrollment Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be enrolled in this course to view this lesson.
          </p>
          <Button asChild>
            <Link href={`/courses/${lesson.course.slug}`}>Go to Course Page</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const nextLesson = lesson.course.lessons.find((l) => l.order === lesson.order + 1);
  const nextUrl = nextLesson ? `/courses/${courseSlug}/lessons/${nextLesson.id}/${nextLesson.slug}` : undefined;

  return (
    <div className="container mx-auto px-4 max-w-5xl py-8 space-y-8">
      {/* Header */}
      <LessonSummaryHeader lesson={lesson} nextLessonUrl={nextUrl} />

      {/* Teacher or Student Action */}
      <div className="flex justify-end space-x-2 mb-4">
        {lesson.course.author.id === user!.id ? (
          <Button asChild>
            <Link href={`/courses/${courseSlug}/lessons/${lessonId}/${lesson.slug}/edit`}>
              Edit Lesson
            </Link>
          </Button>
        ) : (
          <ViewToggle lessonId={lessonId} initiallyViewed={viewed} />
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Summary & Related Questions */}
        <div className="md:col-span-2 space-y-8">
          <LessonSummary summary={lesson.summary || ""} />
          <RelatedQuestions questions={lesson.questions} />
        </div>

        {/* Right Column: Resources & Quick Actions */}
        <div className="space-y-6">
          <LessonResources files={lesson.files} />
          <QuickActions files={lesson.files} />
        </div>
      </div>
    </div>
  );
}
