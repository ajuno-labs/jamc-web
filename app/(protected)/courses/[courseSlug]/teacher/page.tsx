import React from "react"
import { notFound } from "next/navigation"
import { getAuthUser } from "@/lib/auth/get-user"
import { getEnhancedPrisma } from "@/lib/db/enhanced"
import { DashboardPage } from "./_components/DashboardPage"
import { randomBytes } from "crypto"
import { getCourseStudentActivity } from './_actions/student-activity-actions'

interface TeacherDashboardPageProps {
  params: Promise<{ courseSlug: string }>
}

export default async function TeacherDashboardPage({ params }: TeacherDashboardPageProps) {
  const { courseSlug } = await params

  // Ensure user is authenticated
  const user = await getAuthUser()
  if (!user) {
    notFound()
  }

  // Initialize enhanced Prisma client with access policies
  const db = await getEnhancedPrisma()

  // Verify that the current user is the course instructor
  let course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true, authorId: true, title: true, joinCode: true }
  })
  if (!course || course.authorId !== user.id) {
    notFound()
  }

  // Generate a unique join code if not already set
  if (!course!.joinCode) {
    const code = randomBytes(4).toString('hex').toUpperCase()
    await db.course.update({
      where: { id: course!.id },
      data: { joinCode: code }
    })
    course = { ...course, joinCode: code }
  }

  // Get comprehensive student activity data
  const activitySummary = await getCourseStudentActivity(courseSlug)

  // Fetch the instructor's courses for the sidebar
  const courses = await db.course.findMany({
    where: { authorId: user.id },
    select: { slug: true, title: true },
  })

  // Fetch questions for this course with author and answer counts
  const rawQuestions = await db.question.findMany({
    where: { courseId: course.id },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { answers: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Serialize dates for client component, defaulting null author names to 'Unknown'
  const questions = rawQuestions.map(q => ({
    id: q.id,
    content: q.content,
    slug: q.slug,
    createdAt: q.createdAt.toISOString(),
    author: { id: q.author.id, name: q.author.name ?? 'Unknown' },
    _count: q._count
  }))

  return <DashboardPage
    questions={questions}
    courses={courses}
    currentCourseSlug={courseSlug}
    joinCode={course!.joinCode}
    activitySummary={activitySummary}
  />
} 