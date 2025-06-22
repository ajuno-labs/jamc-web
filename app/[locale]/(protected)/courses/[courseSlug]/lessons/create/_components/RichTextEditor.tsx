"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MathContent } from "@/components/MathContent"

export function RichTextEditor({
 value: externalValue,
 onChange: externalOnChange,
}: {
 value?: string
 onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  const [content, setContent] = useState(externalValue ?? "")
  const [charCount, setCharCount] = useState(0)
  const maxChars = 2000

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setCharCount(newContent.length)
    externalOnChange?.(e)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Textarea
          className="min-h-[200px] resize-y"
          placeholder="Enter lesson summary..."
          value={content}
          onChange={handleContentChange}
        />
      </CardContent>

      <CardFooter className="flex flex-col p-2">
        <div className="w-full border-t border-gray-200 pt-2">
          <MathContent content={content} />
        </div>
        <span className="text-xs text-muted-foreground mt-2">
          {charCount} / {maxChars} chars
        </span>
      </CardFooter>
    </Card>
  )
}
