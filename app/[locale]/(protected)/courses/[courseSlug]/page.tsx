import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAuthUser } from "@/lib/auth/get-user";
import { getPublicEnhancedPrisma, getEnhancedPrisma } from "@/lib/db/enhanced";
import { CourseContent } from "./_components/course-content";
import { CourseStats } from "./_components/course-stats";
import { CourseSidebar } from "./_components/course-sidebar";

// Generate metadata for the page
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

  // Use enhanced Prisma client with user context to respect policies
  const db = await getEnhancedPrisma();

  // Get course with lessons and enrollment count
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      modules: {
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          chapters: {
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  order: true,
                },
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      enrollments: {
        select: { userId: true },
      },
      author: { select: { id: true, name: true, image: true } },
    },
  });

  if (!course) {
    notFound();
  }

  // Check if user is enrolled
  const isEnrolled = userId
    ? course.enrollments.some((e) => e.userId === userId)
    : false;

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
            lessonCount={course.modules.reduce(
              (total, module) =>
                total + module.chapters.reduce((ctotal, chap) => ctotal + chap.lessons.length, 0),
              0
            )}
            studentCount={course.enrollments.length}
            updatedAt={course.updatedAt}
          />

          <CourseContent
            courseSlug={courseSlug}
            modules={course.modules}
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
            firstLesson={
              course.modules[0]?.chapters[0]?.lessons[0]
                ? {
                    id: course.modules[0].chapters[0].lessons[0].id,
                    slug: course.modules[0].chapters[0].lessons[0].slug,
                  }
                : null
            }
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
