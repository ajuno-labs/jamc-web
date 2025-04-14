import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { 
  getLessonById, 
  canAccessLesson,
  type LessonWithNavigation
} from "./_actions/lesson-actions"

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { courseSlug: string; lessonId: string; lessonSlug: string }
}): Promise<Metadata> {
  const lesson = await getLessonById(params.lessonId)
  
  if (!lesson) {
    return {
      title: "Lesson Not Found",
      description: "The requested lesson could not be found.",
    }
  }
  
  return {
    title: `${lesson.title} - ${lesson.course.title}`,
    description: lesson.theory.slice(0, 160),
  }
}

export default async function LessonPage({
  params,
}: {
  params: { courseSlug: string; lessonId: string; lessonSlug: string }
}) {
  // Get lesson with course and navigation info
  const lesson = await getLessonById(params.lessonId) as LessonWithNavigation | null

  if (!lesson) {
    notFound()
  }

  // Verify the slugs match
  if (lesson.course.slug !== params.courseSlug || lesson.slug !== params.lessonSlug) {
    redirect(`/courses/${lesson.course.slug}/lessons/${params.lessonId}/${lesson.slug}`)
  }

  // Check if user can access the lesson
  const hasAccess = await canAccessLesson(lesson)
  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Enrollment Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be enrolled in this course to view this lesson.
          </p>
          <Button asChild>
            <Link href={`/courses/${params.courseSlug}`}>
              Go to Course Page
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  // Get previous and next lessons
  const prevLesson = lesson.course.lessons.find(l => l.order === lesson.order - 1)
  const nextLesson = lesson.course.lessons.find(l => l.order === lesson.order + 1)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href={`/courses/${params.courseSlug}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to {lesson.course.title}
          </Link>
        </div>

        {/* Lesson Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1>{lesson.title}</h1>
          
          <div dangerouslySetInnerHTML={{ __html: lesson.theory }} />
          
          {lesson.examples && (
            <>
              <h2>Examples</h2>
              <div dangerouslySetInnerHTML={{ __html: lesson.examples }} />
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between">
          {prevLesson ? (
            <Button variant="outline" asChild>
              <Link href={`/courses/${params.courseSlug}/lessons/${prevLesson.id}/${prevLesson.slug}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                {prevLesson.title}
              </Link>
            </Button>
          ) : (
            <div /> // Empty div for spacing
          )}

          {nextLesson && (
            <Button asChild>
              <Link href={`/courses/${params.courseSlug}/lessons/${nextLesson.id}/${nextLesson.slug}`}>
                {nextLesson.title}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 