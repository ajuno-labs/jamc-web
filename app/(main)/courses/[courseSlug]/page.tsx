import { notFound } from "next/navigation"
import { Metadata } from "next"
import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { CourseContent } from "./_components/course-content"
import { CourseStats } from "./_components/course-stats"
import { CourseSidebar } from "./_components/course-sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StructureItem {
  id: string
  title: string
  children?: StructureItem[]
}

interface DisplayInfo {
  title: string
  parent?: {
    title: string
  }
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { courseSlug: string }
}): Promise<Metadata> {
  const course = await prisma.course.findUnique({
    where: { slug: params.courseSlug }
  })
  
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
  params: { courseSlug: string }
}) {
  const { courseSlug } = params

  // Get course with lessons and enrollment count
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      lessons: {
        orderBy: { order: 'asc' }
      },
      enrollments: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
  
  if (!course) {
    notFound()
  }
  
  // Get current user session
  const session = await auth()
  const userId = session?.user?.id
  
  // Check if user is enrolled
  const isEnrolled = userId ? course.enrollments.some(e => e.userId === userId) : false

  // Parse the course structure from JSON
  const structure = course.structure ? JSON.parse(course.structure as string) : null
  
  // Function to get lesson display info based on parent info
  const getLessonDisplayInfo = (lesson: { parentId: string | null }) => {
    if (!structure || !lesson.parentId) return null
    
    const findInStructure = (items: StructureItem[], targetId: string): DisplayInfo | null => {
      for (const item of items) {
        if (item.id === targetId) return { title: item.title }
        if (item.children) {
          const found = findInStructure(item.children, targetId)
          if (found) return { ...found, parent: { title: item.title } }
        }
      }
      return null
    }
    
    return findInStructure(structure, lesson.parentId)
  }

  // Add display info to lessons
  const lessonsWithDisplayInfo = course.lessons.map(lesson => ({
    ...lesson,
    displayInfo: getLessonDisplayInfo(lesson)
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
            {userId === course.author.id && (
              <Button className="mt-4" asChild>
                <Link href={`/courses/${courseSlug}/teacher`}>Q&A Dashboard</Link>
              </Button>
            )}
          </div>

          <CourseStats 
            lessonCount={course.lessons.length}
            studentCount={course.enrollments.length}
            updatedAt={course.updatedAt}
          />

          <CourseContent 
            courseSlug={courseSlug}
            lessons={lessonsWithDisplayInfo}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CourseSidebar
            courseId={course.id}
            courseSlug={courseSlug}
            isEnrolled={isEnrolled}
            isLoggedIn={!!userId}
            firstLesson={course.lessons[0] ? {
              id: course.lessons[0].id,
              slug: course.lessons[0].slug
            } : null}
            instructor={{
              name: course.author.name,
              image: course.author.image
            }}
          />
        </div>
      </div>
    </div>
  )
} 