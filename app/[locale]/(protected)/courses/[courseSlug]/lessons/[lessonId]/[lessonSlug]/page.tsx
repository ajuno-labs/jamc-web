import { redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
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
import LessonNavigation from "./_components/LessonNavigation";
import { getLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{ courseSlug: string; lessonId: string; lessonSlug: string }>;
}

export default async function LessonSummaryPage({ params }: PageProps) {
  const { courseSlug, lessonId, lessonSlug } = await params;
  const locale = await getLocale();

  const lesson = await getLessonSummary(lessonId);
  if (!lesson) {
    notFound();
  }

  if (lesson.course.slug !== courseSlug || lesson.slug !== lessonSlug) {
    return redirect({
      href: `/courses/${lesson.course.slug}/lessons/${lessonId}/${lesson.slug}`,
      locale,
    });
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
        lesson.course.enrollments.some(e => e.userId === user.id))
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

  const currentOrder = lesson.order;
  const previousLesson = lesson.course.lessons.find(l => l.order === currentOrder - 1);
  const nextLesson = lesson.course.lessons.find(l => l.order === currentOrder + 1);
  
  const previousUrl = previousLesson ? `/courses/${courseSlug}/lessons/${previousLesson.id}/${previousLesson.slug}` : undefined;
  const nextUrl = nextLesson ? `/courses/${courseSlug}/lessons/${nextLesson.id}/${nextLesson.slug}` : undefined;

  return (
    <div className="container mx-auto px-4 max-w-5xl py-8 space-y-8">
      <LessonSummaryHeader lesson={lesson} nextLessonUrl={nextUrl} />

      <LessonNavigation 
        previousLessonUrl={previousUrl}
        nextLessonUrl={nextUrl}
      />

      {/* Teacher or Student Action */}
      <div className="flex justify-end space-x-2 mb-4">
        {lesson.course.author.id === user!.id ? (
          <Button asChild>
            <Link href={`/courses/${courseSlug}/lessons/${lessonId}/${lesson.slug}/edit`}>
              Edit Lesson
            </Link>
          </Button>
        ) : (
          <ViewToggle 
            lessonId={lessonId} 
            lessonTitle={lesson.title}
            courseId={lesson.course.id}
            initiallyViewed={viewed} 
            nextLessonUrl={nextUrl}
          />
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
