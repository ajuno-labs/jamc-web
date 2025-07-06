"use client"

import { useState, useEffect } from "react"
import { X, Tag as TagIcon, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getTags } from "../_actions/tags"
import { useTranslations } from 'next-intl'

interface Tag {
  id: string
  name: string
  description: string | null
  count: number
}

interface TagFilterProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

/**
 * Renders a tag selection UI that allows users to search, select, and manage tags from a list.
 *
 * Displays a popover with searchable tag options, supports multi-selection, and shows selected tags with options to remove individual tags or clear all selections. Tag data is fetched asynchronously on mount. UI strings are internationalized.
 *
 * @param selectedTags - Array of currently selected tag names
 * @param onTagsChange - Callback invoked with the updated array of selected tag names when the selection changes
 *
 * @returns A React component for tag filtering and selection
 */
export function TagFilter({ selectedTags, onTagsChange }: TagFilterProps) {
  const t = useTranslations('QuestionsPage.search')
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true)
      try {
        const tagsData = await getTags()
        setTags(tagsData)
      } catch (error) {
        console.error("Error fetching tags:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [])

  // Toggle a tag selection
  const toggleTag = (tagName: string) => {
    const isSelected = selectedTags.includes(tagName)
    if (isSelected) {
      onTagsChange(selectedTags.filter((t) => t !== tagName))
    } else {
      onTagsChange([...selectedTags, tagName])
    }
  }

  // Remove a tag from selection
  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tagName))
  }

  // Clear all selected tags
  const clearTags = () => {
    onTagsChange([])
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Tag selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="justify-between w-full md:w-[250px]"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4" />
              <span>{selectedTags.length > 0 ? t('tagsSelected', { count: selectedTags.length }) : t('selectTags')}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full md:w-[250px]" align="start">
          <Command>
            <CommandInput placeholder={t('searchTags')} />
            <CommandList>
              <CommandEmpty>{t('noTagsFound')}</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[200px]">
                  {tags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => toggleTag(tag.name)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <TagIcon className="h-3.5 w-3.5" />
                        <span>{tag.name}</span>
                        <Badge variant="outline" className="ml-1 px-1.5 text-xs">
                          {tag.count}
                        </Badge>
                      </div>
                      {selectedTags.includes(tag.name) && (
                        <Check className="h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tagName) => (
            <Badge 
              key={tagName} 
              variant="secondary"
              className="flex items-center gap-1 py-1"
            >
              <TagIcon className="h-3 w-3" />
              {tagName}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-secondary-foreground/10 rounded-full"
                onClick={() => removeTag(tagName)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tagName}</span>
              </Button>
            </Badge>
          ))}
          
          {selectedTags.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={clearTags}
            >
              {t('clearAll')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 
