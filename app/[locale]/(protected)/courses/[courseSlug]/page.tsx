import { notFound } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { getCourseDetail } from "@/lib/actions/course-actions";
import { CourseContent } from "./_components/course-content";
import { CourseStats } from "./_components/course-stats";
import { CourseSidebar } from "./_components/course-sidebar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}): Promise<Metadata> {
  const { courseSlug } = await params;
  const db = await getEnhancedPrisma();
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
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });
  const userId = user?.id;

  const course = await getCourseDetail(courseSlug);

  if (!course) {
    notFound();
  }

  const isEnrolled = userId ? course.enrollments.some((e) => e.userId === userId) : false;

  const lessonsInHierarchy = course.modules.reduce(
    (total, mod) => total + mod.chapters.reduce((ctotal, chap) => ctotal + chap.lessons.length, 0),
    0
  );
  const lessonCount = lessonsInHierarchy + (course.lessons?.length ?? 0);

  const firstNestedLesson = course.modules[0]?.chapters[0]?.lessons[0];
  const firstLesson = firstNestedLesson
    ? { id: firstNestedLesson.id, slug: firstNestedLesson.slug }
    : course.lessons?.[0]
      ? { id: course.lessons[0].id, slug: course.lessons[0].slug }
      : null;

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
