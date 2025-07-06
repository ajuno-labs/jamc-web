import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TagFilter } from "./tag-filter"
import { useTranslations } from 'next-intl'

type QuestionType = 'YOLO' | 'FORMAL'

interface QuestionSearchProps {
  query: string
  onQueryChange: (query: string) => void
  selectedType: "all" | QuestionType
  onTypeChange: (type: "all" | QuestionType) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

/**
 * Renders a search and filter UI for questions, allowing users to filter by query, type, and tags with localization support.
 *
 * Provides a controlled interface for updating the search query, selecting a question type, and choosing tags. All UI text is localized.
 */
export function QuestionSearch({
  query,
  onQueryChange,
  selectedType,
  onTypeChange,
  selectedTags,
  onTagsChange,
}: QuestionSearchProps) {
  const t = useTranslations('QuestionsPage.search')
  
  return (
    <div className="flex flex-col gap-6">
      {/* Search and Type filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t('placeholder')}
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            onClick={() => onTypeChange("all")}
          >
            {t('allTypes')}
          </Button>
          <Button
            variant={selectedType === "YOLO" ? "default" : "outline"}
            onClick={() => onTypeChange("YOLO")}
          >
            {t('yolo')}
          </Button>
          <Button
            variant={selectedType === "FORMAL" ? "default" : "outline"}
            onClick={() => onTypeChange("FORMAL")}
          >
            {t('formal')}
          </Button>
        </div>
      </div>
      
      {/* Tag filter */}
      <TagFilter 
        selectedTags={selectedTags} 
        onTagsChange={onTagsChange} 
      />
    </div>
  )
} 
