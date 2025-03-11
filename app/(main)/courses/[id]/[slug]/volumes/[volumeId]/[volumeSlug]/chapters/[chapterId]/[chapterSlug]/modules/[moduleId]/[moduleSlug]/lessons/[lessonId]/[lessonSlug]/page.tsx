import { notFound } from "next/navigation"
import { Metadata } from "next"
import { 
  getCourseById, 
  getChapterById, 
  getModuleById, 
  getLessonById,
  getActivitiesForLesson 
} from "@/app/actions/course-actions"
import { ActivityCard } from "@/app/(main)/courses/_components/activity-card"
import { FileText } from "lucide-react"
import { ActivityCardProps } from "@/lib/types/course-structure"

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
    moduleSlug: string,
    lessonId: string,
    lessonSlug: string
  }
}): Promise<Metadata> {
  const lesson = await getLessonById(params.lessonId)
  
  if (!lesson) {
    return {
      title: "Lesson Not Found",
      description: "The requested lesson could not be found.",
    }
  }
  
  return {
    title: `${lesson.title} - ${lesson.module.title}`,
    description: `Learn about ${lesson.title}`,
  }
}

export default async function LessonDetailPage({
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
    moduleSlug: string,
    lessonId: string,
    lessonSlug: string
  }
}) {
  const { 
    id, slug, volumeId, volumeSlug, chapterId, chapterSlug, 
    moduleId, moduleSlug, lessonId, lessonSlug 
  } = params

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
  
  // Get the lesson
  const lesson = await getLessonById(lessonId)
  
  if (!lesson) {
    notFound()
  }
  
  // Verify that the lesson slug matches
  if (lesson.slug !== lessonSlug) {
    notFound()
  }
  
  // Verify that the lesson belongs to the module
  if (lesson.module.id !== moduleId) {
    notFound()
  }
  
  // Get activities for this lesson
  const activities = await getActivitiesForLesson(lessonId)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2 flex-wrap">
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
          <a 
            href={`/courses/${id}/${slug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}/modules/${moduleId}/${moduleSlug}`}
            className="hover:text-primary transition-colors"
          >
            {module.title}
          </a>
          <span>/</span>
          <span>Lesson</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
        </div>
      </div>
      
      <div className="mb-8 max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Theory</h2>
        <div className="prose dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: lesson.theory }} />
        </div>
      </div>
      
      {lesson.examples && (
        <div className="mb-8 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Examples</h2>
          <div className="prose dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: lesson.examples }} />
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Activities</h2>
        
        {activities.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-xl font-medium mb-2">No activities available</h3>
            <p className="text-muted-foreground">This lesson doesn&apos;t have any activities yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity: ActivityCardProps) => (
              <ActivityCard key={activity.id} {...activity} />
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
          href={`/courses/${id}/${slug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}/modules/${moduleId}/${moduleSlug}`}
          className="text-primary hover:underline"
        >
          ← Back to module
        </a>
      </div>
    </div>
  )
} 