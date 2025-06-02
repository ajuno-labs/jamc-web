"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Clock, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

// Props for metadata values and change handlers
export interface MetadataSectionProps {
  tags: string
  readingTime: string
  onTagsChange: (value: string) => void
  onReadingTimeChange: (value: string) => void
}

export function MetadataSection({ tags, readingTime, onTagsChange, onReadingTimeChange }: MetadataSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {/* Divider for Additional Metadata */}
      <Separator className="mt-8" />
      <div className="pt-4">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full p-0 h-auto"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-sm font-medium">Additional Metadata</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="tags" className="flex items-center mb-1">
                <Tag className="h-4 w-4 mr-1" />
                Tags / Keywords
              </Label>
              <Input id="tags" name="tags" value={tags} onChange={e => onTagsChange(e.target.value)} placeholder="Enter tags separated by commas..." className="w-full" />
              <p className="mt-1 text-xs text-muted-foreground">Add relevant keywords to help with search and categorization</p>
            </div>

            <div>
              <Label htmlFor="reading-time" className="flex items-center mb-1">
                <Clock className="h-4 w-4 mr-1" />
                Estimated Reading Time (minutes)
              </Label>
              <Input id="reading-time" name="readingTime" type="number" value={readingTime} onChange={e => onReadingTimeChange(e.target.value)} placeholder="5" className="w-full" />
              <p className="mt-1 text-xs text-muted-foreground">
                Auto-calculated based on content length, but can be manually adjusted
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
