import { notFound } from "next/navigation"
import { Metadata } from "next"
import { 
  getCourseById, 
  getChapterById, 
  getModuleById, 
  getLessonsForModule 
} from "@/app/actions/course-actions"
import { LessonCard } from "@/app/(main)/courses/_components/lesson-card"
import { BookCopy } from "lucide-react"
import { LessonCardProps } from "@/lib/types/course-structure"

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { 
    id: string, 
    slug: string, 
    volumeId: string, 
    volumeSlug: string, 
    chapterId: string, 
    chapterSlug: string,
    moduleId: string,
    moduleSlug: string
  }
}): Promise<Metadata> {
  const module = await getModuleById(params.moduleId)
  
  if (!module) {
    return {
      title: "Module Not Found",
      description: "The requested module could not be found.",
    }
  }
  
  return {
    title: `${module.title} - ${module.chapter?.title || "Module"}`,
    description: `Browse lessons in ${module.title}`,
  }
}

export default async function ModuleDetailPage({
  params,
}: {
  params: { 
    id: string, 
    slug: string, 
    volumeId: string, 
    volumeSlug: string, 
    chapterId: string, 
    chapterSlug: string,
    moduleId: string,
    moduleSlug: string
  }
}) {
  const { id, slug, volumeId, volumeSlug, chapterId, chapterSlug, moduleId, moduleSlug } = params

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
  
  // Get the module
  const module = await getModuleById(moduleId)
  
  if (!module) {
    notFound()
  }
  
  // Verify that the module slug matches
  if (module.slug !== moduleSlug) {
    notFound()
  }
  
  // Verify that the module belongs to the chapter
  if (module.chapter?.id !== chapterId) {
    notFound()
  }
  
  // Get lessons for this module
  const lessons = await getLessonsForModule(moduleId)
  
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
          <a 
            href={`/courses/${id}/${slug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}`}
            className="hover:text-primary transition-colors"
          >
            {chapter.title}
          </a>
          <span>/</span>
          <span>Module</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <BookCopy className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{module.title}</h1>
        </div>
      </div>
      
      <div className="mb-8 max-w-4xl">
        <div className="prose dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: module.content }} />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Lessons</h2>
        
        {lessons.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-xl font-medium mb-2">No lessons available</h3>
            <p className="text-muted-foreground">This module doesn&apos;t have any lessons yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson: LessonCardProps) => (
              <LessonCard key={lesson.id} {...lesson} />
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
          href={`/courses/${id}/${slug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}`}
          className="text-primary hover:underline"
        >
          ← Back to chapter
        </a>
      </div>
    </div>
  )
} 