"use server"

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

export type SimilarQuestion = {
  question_id: string
  slug: string
  title: string
  content: string | null
  similarity_score: number
  tags: string[] | null
  category: string | null
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
 * Limited to most recent 100 questions for performance
 */
export async function getExistingQuestions(): Promise<ExistingQuestion[]> {
  const db = getPublicEnhancedPrisma()
  return db.question.findMany({
    where: { visibility: 'PUBLIC' },
    select: { id: true, title: true, slug: true },
    orderBy: { createdAt: 'desc' },
    take: 100, // Limit to 100 most recent questions
  })
}

/**
 * Search for similar questions using the semantic search API
 */
export async function searchSimilarQuestions(
  query: string,
  topK: number = 5,
  threshold: number = 0.5
): Promise<SimilarQuestion[]> {
  const semanticSearchUrl = process.env.SIMILARITY_API_URL || "http://localhost:8000"
  
  try {
    const response = await fetch(`${semanticSearchUrl}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        top_k: topK,
        threshold
      }),
    })

    if (!response.ok) {
      throw new Error(`Semantic search API error: ${response.status}`)
    }

    const data = await response.json()
    const results = data.results || []
    
    if (results.length > 0) {
      const db = getPublicEnhancedPrisma()
      const questionIds = results.map((r: { question_id: string }) => r.question_id)
      
      const questionsWithSlugs = await db.question.findMany({
        where: { id: { in: questionIds } },
        select: { id: true, slug: true }
      })
      
      const slugMap = new Map(questionsWithSlugs.map(q => [q.id, q.slug]))
      
      return results.map((result: { question_id: string; [key: string]: unknown }) => ({
        ...result,
        slug: slugMap.get(result.question_id) || result.question_id
      }))
    }
    
    return results
  } catch (error) {
    console.error("Error searching similar questions:", error)
    throw new Error("Failed to search for similar questions")
  }
}

/**
 * Add a question to the semantic search index
 */
export async function addQuestionToSearchIndex(question: {
  id: string
  slug: string
  title: string
  content?: string | null
  tags?: string[]
  category?: string | null
}): Promise<void> {
  const semanticSearchUrl = process.env.SIMILARITY_API_URL || "http://localhost:8000"
  
  try {
    const response = await fetch(`${semanticSearchUrl}/questions/add-single`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: question.id,
        slug: question.slug,
        title: question.title,
        content: question.content,
        tags: question.tags,
        category: question.category
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to add question to search index: ${response.status}`)
    }
  } catch (error) {
    console.error("Error adding question to search index:", error)
  }
}
