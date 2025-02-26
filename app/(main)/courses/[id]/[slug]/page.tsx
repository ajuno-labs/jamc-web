import { notFound } from "next/navigation"
import { Metadata } from "next"
import { auth } from "@/auth"
import { getCourseById } from "../../_actions/course-actions"
import { checkEnrollmentStatus } from "../../_actions/enrollment-actions"
import { CourseWithRelations } from "@/lib/types/course"
import CourseInfo from "./_components/course-info"
import CourseSidebar from "./_components/course-sidebar"

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string, slug: string }
}): Promise<Metadata> {
  const course = await getCourseById(params.id)
  
  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    }
  }
  
  return {
    title: course.title,
    description: course.description,
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: { id: string, slug: string }
}) {
  const { id, slug } = params

  const course = await getCourseById(id) as CourseWithRelations | null
  
  if (!course) {
    notFound()
  }
  
  // Verify that the slug matches the course slug
  if (course.slug !== slug) {
    notFound()
  }
  
  // Get current user session
  const session = await auth()
  const userId = session?.user?.id
  
  // Check if user is enrolled
  const enrollmentStatus = userId ? await checkEnrollmentStatus(course.id) : { isEnrolled: false };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CourseInfo 
          course={course}
          isEnrolled={enrollmentStatus.isEnrolled}
        />
        
        <CourseSidebar
          courseId={course.id}
          courseSlug={course.slug}
          isEnrolled={enrollmentStatus.isEnrolled}
          isLoggedIn={!!userId}
          modules={course.modules}
          stats={{
            moduleCount: course.modules.length,
            questionCount: course.questions.length,
            createdAt: new Date(course.createdAt)
          }}
        />
      </div>
    </div>
  )
} 