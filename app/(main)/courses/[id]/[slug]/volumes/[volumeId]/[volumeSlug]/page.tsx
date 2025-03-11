import { notFound } from "next/navigation"
import { Metadata } from "next"
import { 
  getCourseById, 
  getVolumeById, 
  getChaptersForVolume 
} from "@/app/actions/course-actions"
import { ChapterCard } from "../../../../../_components/chapter-card"
import { BookOpen } from "lucide-react"

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string, slug: string, volumeId: string, volumeSlug: string }
}): Promise<Metadata> {
  const volume = await getVolumeById(params.volumeId)
  
  if (!volume) {
    return {
      title: "Volume Not Found",
      description: "The requested volume could not be found.",
    }
  }
  
  return {
    title: `${volume.title} - ${volume.course.title}`,
    description: volume.overview || `Browse chapters in ${volume.title}`,
  }
}

export default async function VolumeDetailPage({
  params,
}: {
  params: { id: string, slug: string, volumeId: string, volumeSlug: string }
}) {
  const { id, slug, volumeId, volumeSlug } = params

  // Get the course
  const course = await getCourseById(id)
  
  if (!course) {
    notFound()
  }
  
  // Verify that the slug matches the course slug
  if (course.slug !== slug) {
    notFound()
  }
  
  // Get the volume
  const volume = await getVolumeById(volumeId)
  
  if (!volume) {
    notFound()
  }
  
  // Verify that the volume slug matches
  if (volume.slug !== volumeSlug) {
    notFound()
  }
  
  // Get chapters for this volume
  const chapters = await getChaptersForVolume(volumeId)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <a 
            href={`/courses/${id}/${slug}`}
            className="hover:text-primary transition-colors"
          >
            {course.title}
          </a>
          <span>/</span>
          <span>Volume</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{volume.title}</h1>
        </div>
        
        {volume.overview && (
          <p className="text-muted-foreground mb-6 max-w-3xl">{volume.overview}</p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Chapters</h2>
        
        {chapters.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-xl font-medium mb-2">No chapters available</h3>
            <p className="text-muted-foreground">This volume doesn&apos;t have any chapters yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} {...chapter} />
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 flex gap-4">
        <a 
          href={`/courses/${id}/${slug}`}
          className="text-primary hover:underline"
        >
          ← Back to course
        </a>
        <a 
          href={`/courses/${id}/${slug}/volumes`}
          className="text-primary hover:underline"
        >
          ← All volumes
        </a>
      </div>
    </div>
  )
} 