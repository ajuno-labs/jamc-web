import { Search, Target, FileText, MessageCircle } from "lucide-react"
import { TagSelector } from "@/components/tag-selector"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from 'next-intl'
import { QuestionType } from "@prisma/client"

interface QuestionSearchProps {
  query: string
  onQueryChange: (query: string) => void
  selectedType: "all" | QuestionType
  onTypeChange: (type: "all" | QuestionType) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

const questionTypeConfig = {
  all: {
    icon: Search,
    label: 'allTypes',
    color: 'text-gray-600'
  },
  [QuestionType.OBJECTIVE]: {
    icon: Target,
    label: 'objective',
    color: 'text-blue-600'
  },
  [QuestionType.STRUCTURED]: {
    icon: FileText,
    label: 'structured',
    color: 'text-green-600'
  },
  [QuestionType.OPINION]: {
    icon: MessageCircle,
    label: 'opinion',
    color: 'text-purple-600'
  }
}

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
    <div className="flex flex-col gap-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {/* Type and Tag filters on same row */}
      <div className="flex gap-1">
        <div className="flex-1">
          <Select
            value={selectedType}
            onValueChange={onTypeChange}
          >
            <SelectTrigger>
              <SelectValue>
                {(() => {
                  const config = questionTypeConfig[selectedType as keyof typeof questionTypeConfig]
                  const Icon = config.icon
                  return (
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <span>{t(config.label)}</span>
                    </div>
                  )
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(questionTypeConfig).map(([type, config]) => {
                const Icon = config.icon
                return (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <span>{t(config.label)}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 pr-2">
          <TagSelector
            selectedTags={selectedTags}
            onTagsChange={onTagsChange}
          />
        </div>
      </div>
    </div>
  )
}
