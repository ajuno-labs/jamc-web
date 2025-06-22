"use client"

import { useState } from "react"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MathContent } from "@/components/MathContent"
import { PreviewToggle } from "../[id]/[slug]/_components/PreviewToggle"
import { QuestionType, Visibility } from "@prisma/client"

interface FormData {
  title: string
  content: string
  type: QuestionType
  visibility: Visibility
}

interface QuestionFormFieldsProps {
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
  contentValue: string
  isSubmitting?: boolean
  showPreviewToggle?: boolean
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  titlePlaceholder?: string
  contentPlaceholder?: string
  contentRows?: number
}

export function QuestionFormFields({
  register,
  errors,
  contentValue,
  isSubmitting = false,
  showPreviewToggle = false,
  onTitleChange,
  titlePlaceholder = "e.g., How do I solve quadratic equations?",
  contentPlaceholder = "Provide more details about your question...",
  contentRows = 8,
}: QuestionFormFieldsProps) {
  const [isPreview, setIsPreview] = useState(false)

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Question Title</Label>
        <Input
          id="title"
          {...register("title")}
          onChange={onTitleChange}
          placeholder={titlePlaceholder}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="content">Description</Label>
          {showPreviewToggle && (
            <PreviewToggle
              isPreview={isPreview}
              onToggle={() => setIsPreview(!isPreview)}
            />
          )}
        </div>
        
        {showPreviewToggle && isPreview ? (
          <Card className="p-4 bg-muted/50 min-h-[200px]">
            <MathContent content={contentValue || ""} />
          </Card>
        ) : (
          <Textarea
            id="content"
            {...register("content")}
            placeholder={contentPlaceholder}
            rows={contentRows}
            disabled={isSubmitting}
          />
        )}
        {errors.content && (
          <p className="text-sm text-destructive">
            {errors.content.message}
          </p>
        )}
      </div>

      {!showPreviewToggle && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <Card className="p-4 bg-muted/50 min-h-[100px]">
            <MathContent content={contentValue || ""} />
          </Card>
        </div>
      )}
    </>
  )
} 