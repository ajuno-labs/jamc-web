import { Card } from "@/components/ui/card"
import { prisma } from "@/lib/db/prisma"
import { QuestionForm } from "./_components/question-form"
import { QuestionContext } from "@/lib/types/question"

interface Tag {
  id: string
  name: string
  description: string | null
  count: number
}

async function getTags(): Promise<Tag[]> {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          questions: true
        }
      }
    },
    orderBy: {
      questions: {
        _count: 'desc'
      }
    }
  })

  return tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    description: tag.description,
    count: tag._count.questions
  }))
}

interface AskQuestionPageProps {
  searchParams: {
    courseId?: string
  }
}

export default async function AskQuestionPage({ searchParams }: AskQuestionPageProps) {
  const tags = await getTags()
  
  // Create initial context with courseId if provided
  const context: QuestionContext = {}
  if (searchParams.courseId) {
    context.courseId = searchParams.courseId
  }

  return (
    <div className="container px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Ask a Question</h1>
      <Card className="p-6">
        <QuestionForm tags={tags} context={context} />
      </Card>
    </div>
  )
} 