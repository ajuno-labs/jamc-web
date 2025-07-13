import { searchAll } from "./_actions/search"
import { CourseCard } from "../courses/_components/course-card"
import { QuestionCard } from "../questions/components/question-card"
import { getTranslations } from 'next-intl/server'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const t = await getTranslations('SearchPage')
  const { q } = await searchParams
  const query = q?.toString() || ""
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground">{t('enterQuery')}</p>
      </div>
    )
  }

  const results = await searchAll(query)

  const hasResults = results.courses.length > 0 || results.questions.length > 0

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">{t('resultsFor', { query })}</h1>

      {results.courses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{t('courses')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.courses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      )}

      {results.questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{t('questions')}</h2>
          <div className="space-y-4">
            {results.questions.map((q) => (
              <QuestionCard
                key={q.id}
                {...q}
              />
            ))}
          </div>
        </div>
      )}

      {!hasResults && (
        <p className="text-muted-foreground">{t('noResults')}</p>
      )}
    </div>
  )
}
