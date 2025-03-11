import { notFound } from "next/navigation"
import { Metadata } from "next"
import { 
  getCourseById, 
  getChapterById, 
  getModulesForChapter 
} from "@/app/actions/course-actions"
import { ModuleCard } from "@/app/(main)/courses/_components/module-card"
import { BookText } from "lucide-react"
import { ModuleCardProps } from "@/lib/types/course-structure"

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string, slug: string, volumeId: string, volumeSlug: string, chapterId: string, chapterSlug: string }
}): Promise<Metadata> {
  const chapter = await getChapterById(params.chapterId)
  
  if (!chapter) {
    return {
      title: "Chapter Not Found",
      description: "The requested chapter could not be found.",
    }
  }
  
  return {
    title: `${chapter.title} - ${chapter.volume.title}`,
    description: chapter.introduction || `Browse modules in ${chapter.title}`,
  }
}

export default async function ChapterDetailPage({
  params,
}: {
  params: { id: string, slug: string, volumeId: string, volumeSlug: string, chapterId: string, chapterSlug: string }
}) {
  const { id, slug, volumeId, volumeSlug, chapterId, chapterSlug } = params

  // Get the course
  const course = await getCourseById(id)
  
  if (!course) {
    notFound()
  }
  
  // Verify that the slug matches the course slug
  if (course.slug !== slug) {
    notFound()
  }
  
  // Get the chapter
  const chapter = await getChapterById(chapterId)
  
  if (!chapter) {
    notFound()
  }
  
  // Verify that the chapter slug matches
  if (chapter.slug !== chapterSlug) {
    notFound()
  }
  
  // Verify that the volume ID and slug match
  if (chapter.volume.id !== volumeId || chapter.volume.slug !== volumeSlug) {
    notFound()
  }
  
  // Get modules for this chapter
  const modules = await getModulesForChapter(chapterId)
  
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
          <a 
            href={`/courses/${id}/${slug}/volumes/${volumeId}/${volumeSlug}`}
            className="hover:text-primary transition-colors"
          >
            {chapter.volume.title}
          </a>
          <span>/</span>
          <span>Chapter</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <BookText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{chapter.title}</h1>
        </div>
        
        {chapter.introduction && (
          <div className="mb-6 max-w-3xl">
            <h2 className="text-xl font-semibold mb-2">Introduction</h2>
            <p className="text-muted-foreground">{chapter.introduction}</p>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Modules</h2>
        
        {modules.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-xl font-medium mb-2">No modules available</h3>
            <p className="text-muted-foreground">This chapter doesn&apos;t have any modules yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module: ModuleCardProps) => (
              <ModuleCard key={module.id} {...module} />
            ))}
          </div>
        )}
      </div>
      
      {chapter.summary && (
        <div className="mb-8 max-w-3xl">
          <h2 className="text-xl font-semibold mb-2">Chapter Summary</h2>
          <p className="text-muted-foreground">{chapter.summary}</p>
        </div>
      )}
      
      <div className="mt-8 flex gap-4">
        <a 
          href={`/courses/${id}/${slug}`}
          className="text-primary hover:underline"
        >
          ← Back to course
        </a>
        <a 
          href={`/courses/${id}/${slug}/volumes/${volumeId}/${volumeSlug}`}
          className="text-primary hover:underline"
        >
          ← Back to volume
        </a>
      </div>
    </div>
  )
} 