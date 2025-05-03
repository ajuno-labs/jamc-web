import { notFound } from "next/navigation"
import { getAuthUser } from "@/lib/auth/get-user"
import { prisma } from "@/lib/db/prisma"
import TeacherDashboardTable from "./_components/TeacherDashboardTable"

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

  // Verify that the current user is the course instructor
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true, authorId: true, title: true }
  })
  if (!course || course.authorId !== user.id) {
    notFound()
  }

  // Fetch questions for this course with author and answer counts
  const rawQuestions = await prisma.question.findMany({
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{course.title} – Q&A Dashboard</h1>
      <TeacherDashboardTable questions={questions} />
    </div>
  )
} 