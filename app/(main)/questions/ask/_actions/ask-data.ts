import { getPublicEnhancedPrisma } from "@/lib/db/enhanced"

export type Tag = {
  id: string
  name: string
  description: string | null
  count: number
}

export type ExistingQuestion = {
  id: string
  title: string
  slug: string
}

/**
 * Fetch all public tags ordered by question count
 */
export async function getTags(): Promise<Tag[]> {
  const db = getPublicEnhancedPrisma()
  const tagsRaw = await db.tag.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      _count: { select: { questions: true } },
    },
    orderBy: { questions: { _count: 'desc' } },
  })
  return tagsRaw.map(tag => ({
    id: tag.id,
    name: tag.name,
    description: tag.description,
    count: tag._count.questions,
  }))
}

/**
 * Fetch existing public questions for similarity suggestions
 */
export async function getExistingQuestions(): Promise<ExistingQuestion[]> {
  const db = getPublicEnhancedPrisma()
  return db.question.findMany({
    where: { visibility: 'PUBLIC' },
    select: { id: true, title: true, slug: true },
  })
} 