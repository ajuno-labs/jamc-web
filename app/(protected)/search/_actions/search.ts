"use server"

import { searchQuestions } from "@/app/(protected)/questions/_actions/search"
import { getCourses } from "@/app/(protected)/courses/_actions/course-actions"

export interface GenericSearchResult {
  courses: Awaited<ReturnType<typeof getCourses>>["data"]
  questions: Awaited<ReturnType<typeof searchQuestions>>["items"]
}

export async function searchAll(query: string): Promise<GenericSearchResult> {
  try {
    const [courses, questions] = await Promise.all([
      getCourses({ searchTerm: query, limit: 5, page: 1 }),
      searchQuestions(query, "all", 1, 5, [])
    ])

    return {
      courses: courses.data,
      questions: questions.items
    }
  } catch (error) {
    console.error("Search all error:", error)
    return { courses: [], questions: [] }
  }
}
