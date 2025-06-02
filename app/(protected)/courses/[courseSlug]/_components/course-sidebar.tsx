import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface CourseSidebarProps {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
  isInstructor: boolean;
  firstLesson?: {
    id: string;
    slug: string;
  } | null;
  instructor: {
    name: string | null;
    image: string | null;
  };
}

export function CourseSidebar({
  courseId,
  courseSlug,
  isEnrolled,
  isLoggedIn,
  isInstructor,
  firstLesson,
  instructor,
}: CourseSidebarProps) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Course Instructor</h3>
        <div className="flex items-center gap-3">
          {instructor.image && (
            <Image
              src={instructor.image}
              alt={instructor.name || "Instructor"}
              className="h-10 w-10 rounded-full"
            />
          )}
          <span>{instructor.name}</span>
        </div>
      </div>

      {isLoggedIn ? (
        isInstructor ? (
          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link
                href={
                  firstLesson
                    ? `/courses/${courseSlug}/lessons/${firstLesson.id}/${firstLesson.slug}`
                    : `/courses/${courseSlug}`
                }
              >
                View Course Content
              </Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href={`/courses/${courseSlug}/teacher`}>
                Go to Course Dashboard
              </Link>
            </Button>
          </div>
        ) : isEnrolled ? (
          <Button className="w-full" asChild>
            <Link
              href={
                firstLesson
                  ? `/courses/${courseSlug}/lessons/${firstLesson.id}/${firstLesson.slug}`
                  : `/courses/${courseSlug}`
              }
            >
              Continue Learning
            </Link>
          </Button>
        ) : (
          <form action={`/api/courses/${courseId}/enroll`} method="POST">
            <Button type="submit" className="w-full">
              Enroll Now
            </Button>
          </form>
        )
      ) : (
        <Button className="w-full" asChild>
          <Link href="/api/auth/signin">Sign in to Enroll</Link>
        </Button>
      )}
    </Card>
  );
}
