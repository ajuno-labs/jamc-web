import { notFound } from "next/navigation"
import { Metadata } from "next"
import { 
  getCourseById, 
  getChapterById, 
  getModuleById, 
  getLessonById,
  getActivityById
} from "@/app/actions/course-actions"
import { PenTool } from "lucide-react"

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
    lessonSlug: string,
    activityId: string,
    activitySlug: string
  }
}): Promise<Metadata> {
  const activity = await getActivityById(params.activityId)
  
  if (!activity) {
    return {
      title: "Activity Not Found",
      description: "The requested activity could not be found.",
    }
  }
  
  return {
    title: `${activity.title} - ${activity.lesson.title}`,
    description: activity.description,
  }
}

export default async function ActivityDetailPage({
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
    lessonSlug: string,
    activityId: string,
    activitySlug: string
  }
}) {
  const { 
    id, slug, volumeId, volumeSlug, chapterId, chapterSlug, 
    moduleId, moduleSlug, lessonId, lessonSlug, activityId, activitySlug 
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
  
  // Get the activity
  const activity = await getActivityById(activityId)
  
  if (!activity) {
    notFound()
  }
  
  // Verify that the activity slug matches
  if (activity.slug !== activitySlug) {
    notFound()
  }
  
  // Verify that the activity belongs to the lesson
  if (activity.lesson.id !== lessonId) {
    notFound()
  }
  
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
          <a 
            href={`/courses/${id}/${slug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}/modules/${moduleId}/${moduleSlug}/lessons/${lessonId}/${lessonSlug}`}
            className="hover:text-primary transition-colors"
          >
            {lesson.title}
          </a>
          <span>/</span>
          <span>Activity</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <PenTool className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{activity.title}</h1>
        </div>
      </div>
      
      <div className="mb-8 max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <div className="prose dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: activity.description }} />
        </div>
      </div>
      
      {activity.problemSet && (
        <div className="mb-8 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Problem Set</h2>
          <div className="prose dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: activity.problemSet }} />
          </div>
        </div>
      )}
      
      {activity.hints && (
        <div className="mb-8 max-w-4xl p-4 bg-muted/20 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Hints</h2>
          <div className="prose dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: activity.hints }} />
          </div>
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
          href={`/courses/${id}/${slug}/volumes/${volumeId}/${volumeSlug}/chapters/${chapterId}/${chapterSlug}/modules/${moduleId}/${moduleSlug}/lessons/${lessonId}/${lessonSlug}`}
          className="text-primary hover:underline"
        >
          ← Back to lesson
        </a>
      </div>
    </div>
  )
} 