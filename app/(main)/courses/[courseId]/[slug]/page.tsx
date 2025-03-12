import { notFound } from "next/navigation"
import { Metadata } from "next"
import { auth } from "@/auth"
import { 
  getCourseById, 
  getCourseWithStructure, 
  checkEnrollmentStatus 
} from "@/app/actions/course-actions"
import CourseInfo from "./_components/course-info"
import CourseSidebar from "./_components/course-sidebar"
// We'll handle the volumes display directly in the page component

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { courseId: string, slug: string }
}): Promise<Metadata> {
  const course = await getCourseById(params.courseId)
  
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
  params: { courseId: string, slug: string }
}) {
  const { courseId, slug } = params

  // Try to get the course with the new structure first
  const courseWithStructure = await getCourseWithStructure(courseId)
  
  // If not found, try the old structure
  const course = courseWithStructure || await getCourseById(courseId)
  
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
  
  // Check if the course has the new structure (volumes)
  const hasNewStructure = courseWithStructure !== null && 'volumes' in course && Array.isArray(course.volumes) && course.volumes.length > 0
  
  // Calculate module count
  let moduleCount = 0
  if (!hasNewStructure && 'modules' in course) {
    // Old structure - modules directly in course
    moduleCount = course.modules.length;
  } else {
    // For new structure, we don't have modules in the volumes/chapters from the courseWithStructureInclude
    // So we'll just use 0 or another placeholder value
    moduleCount = 0;
  }

  // Calculate question count safely
  const questionCount = course.questions?.length ?? 0
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CourseInfo 
            course={course}
            isEnrolled={enrollmentStatus.isEnrolled}
          />
          
          {/* We'll render the volumes directly here instead of using a separate component */}
          {hasNewStructure && courseWithStructure && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Course Structure</h2>
              
              <div className="space-y-6">
                {courseWithStructure.volumes.map((volume) => (
                  <div key={volume.id} className="border rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-muted/50 p-4 border-b">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <span className="text-primary">Volume:</span> {volume.title}
                      </h3>
                    </div>
                    <div className="p-4">
                      {volume.overview && (
                        <p className="text-muted-foreground mb-4">{volume.overview}</p>
                      )}
                      
                      {volume.chapters.length > 0 && (
                        <>
                          <div className="border-t my-4"></div>
                          <h4 className="text-sm font-medium mb-2">Chapters:</h4>
                          <ul className="space-y-2">
                            {volume.chapters.map((chapter) => (
                              <li key={chapter.id} className="flex items-center gap-2">
                                <span className="text-muted-foreground">→</span>
                                <a 
                                  href={`/courses/${course.id}/${course.slug}/volumes/${volume.id}/chapters/${chapter.id}`}
                                  className="text-sm hover:text-primary transition-colors"
                                >
                                  {chapter.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <CourseSidebar
            courseId={course.id}
            courseSlug={course.slug}
            isEnrolled={enrollmentStatus.isEnrolled}
            isLoggedIn={!!userId}
            modules={!hasNewStructure && 'modules' in course ? course.modules : []}
            stats={{
              moduleCount,
              questionCount,
              createdAt: new Date(course.createdAt)
            }}
            hasNewStructure={hasNewStructure}
            volumeCount={hasNewStructure && courseWithStructure ? courseWithStructure.volumes.length : 0}
            chapterCount={hasNewStructure && courseWithStructure 
              ? courseWithStructure.volumes.reduce((acc, vol) => acc + vol.chapters.length, 0)
              : 0}
          />
        </div>
      </div>
    </div>
  )
} 