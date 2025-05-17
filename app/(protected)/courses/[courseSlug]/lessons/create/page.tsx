import LessonSummaryClient from './_components/LessonSummaryClient'

interface PageProps {
  params: Promise<{ courseSlug: string }>
}

export default async function Page({ params }: PageProps) {
  const { courseSlug } = await params
  return <LessonSummaryClient courseSlug={courseSlug} />
}
