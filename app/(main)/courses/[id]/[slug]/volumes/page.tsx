import { notFound } from "next/navigation"
import { Metadata } from "next"
import { 
  getCourseById, 
  getVolumesForCourse 
} from "@/app/actions/course-actions"
import { VolumeCard } from "../../../_components/volume-card"

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
    title: `Volumes - ${course.title}`,
    description: `Browse all volumes for ${course.title}`,
  }
}

export default async function CourseVolumesPage({
  params,
}: {
  params: { id: string, slug: string }
}) {
  const { id, slug } = params

  // Get the course
  const course = await getCourseById(id)
  
  if (!course) {
    notFound()
  }
  
  // Verify that the slug matches the course slug
  if (course.slug !== slug) {
    notFound()
  }
  
  // Get all volumes for the course
  const volumes = await getVolumesForCourse(id)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-muted-foreground">Browse all volumes for this course</p>
      </div>
      
      {volumes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No volumes available</h2>
          <p className="text-muted-foreground">This course doesn&apos;t have any volumes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volumes.map((volume) => (
            <VolumeCard key={volume.id} {...volume} />
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <a 
          href={`/courses/${id}/${slug}`}
          className="text-primary hover:underline"
        >
          ← Back to course
        </a>
      </div>
    </div>
  )
} 