"use client"

import React, { useState } from "react"
import { Check, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CourseTag } from "@/lib/types/course"

interface TagSelectorProps {
  selectedTags: string[]
  availableTags: CourseTag[]
  onTagsChange: (tags: string[]) => void
}

export function TagSelector({ selectedTags = [], availableTags, onTagsChange }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [newTag, setNewTag] = useState("")

  const handleSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleRemove = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag))
  }

  const handleAddNewTag = () => {
    const trimmed = newTag.trim()
    if (trimmed && !selectedTags.includes(trimmed) && !availableTags.find(t => t.name === trimmed)) {
      onTagsChange([...selectedTags, trimmed])
      setNewTag("")
    }
  }

  const filteredTags = availableTags.filter(tag => !selectedTags.includes(tag.name))

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tagName => (
          <Badge key={tagName} variant="secondary" className="px-3 py-1">
            {tagName}
            <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 rounded-full" onClick={() => handleRemove(tagName)}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {selectedTags.length === 0 && <div className="text-sm text-muted-foreground">No tags selected</div>}
      </div>

      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              {selectedTags.length > 0 ? "Add more tags" : "Add tags"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]" align="start" side="bottom">
            <Command>
              <CommandInput placeholder="Search for tags..." />
              <CommandList>
                <CommandEmpty>
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-sm text-muted-foreground">No tags found.</p>
                    <div className="mt-4 flex items-center gap-2">
                      <Input
                        type="text"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        placeholder="Create new tag"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <Button size="sm" onClick={handleAddNewTag} disabled={!newTag.trim()}>
                        Add
                      </Button>
                    </div>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {filteredTags.map(tag => (
                    <CommandItem key={tag.name} value={tag.name} onSelect={() => handleSelect(tag.name)}>
                      {tag.name}
                      <Check className={cn("ml-auto h-4 w-4", selectedTags.includes(tag.name) ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
} 