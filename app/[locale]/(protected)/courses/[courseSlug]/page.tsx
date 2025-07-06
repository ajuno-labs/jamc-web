import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAuthUser } from "@/lib/auth/get-user";
import { getPublicEnhancedPrisma } from "@/lib/db/enhanced";
import { getCourseDetail } from "@/lib/actions/course-actions";
import { CourseContent } from "./_components/course-content";
import { CourseStats } from "./_components/course-stats";
import { CourseSidebar } from "./_components/course-sidebar";

export async function generateMetadata({ params }: { params: Promise<{ courseSlug: string }> }): Promise<Metadata> {
  const { courseSlug } = await params;
  const db = getPublicEnhancedPrisma();
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: { title: true, description: true },
  });

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  // Retrieve current user and user ID for context
  const user = await getAuthUser();
  const userId = user?.id;

  const course = await getCourseDetail(courseSlug);

  if (!course) {
    notFound();
  }

  // Check if user is enrolled
  const isEnrolled = userId
    ? course.enrollments.some((e) => e.userId === userId)
    : false;

  // Total lesson count (hierarchical + top-level)
  const lessonsInHierarchy = course.modules.reduce(
    (total, mod) =>
      total + mod.chapters.reduce((ctotal, chap) => ctotal + chap.lessons.length, 0),
    0
  );
  const lessonCount = lessonsInHierarchy + (course.lessons?.length ?? 0);

  // Determine first lesson to link to (hierarchical first, else top-level)
  const firstNestedLesson = course.modules[0]?.chapters[0]?.lessons[0];
  const firstLesson = firstNestedLesson
    ? { id: firstNestedLesson.id, slug: firstNestedLesson.slug }
    : course.lessons?.[0]
      ? { id: course.lessons[0].id, slug: course.lessons[0].slug }
      : null;

  // Detect if the current user is the course instructor
  const isInstructor = userId === course.author.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
          </div>

          <CourseStats
            lessonCount={lessonCount}
            studentCount={course.enrollments.length}
            updatedAt={course.updatedAt}
          />

          <CourseContent
            courseSlug={courseSlug}
            modules={course.modules}
            lessons={course.lessons ?? []}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CourseSidebar
            courseId={course.id}
            courseSlug={courseSlug}
            isEnrolled={isEnrolled}
            isLoggedIn={!!userId}
            isInstructor={isInstructor}
            firstLesson={firstLesson}
            instructor={{
              name: course.author.name,
              image: course.author.image,
            }}
          />
        </div>
      </div>
    </div>
  );
}
