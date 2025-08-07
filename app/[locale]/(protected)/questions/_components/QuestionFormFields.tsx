"use client"

import { useState } from "react"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MathContent } from "@/components/MathContent"
import { PreviewToggle } from "../[id]/[slug]/_components/PreviewToggle"
import { QuestionType, Visibility } from "@prisma/client"
import { useTranslations } from "next-intl"
import { Plus, ChevronDown, ChevronUp } from "lucide-react"

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
  titleValue?: string
  isSubmitting?: boolean
  showPreviewToggle?: boolean
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  titlePlaceholder?: string
  contentPlaceholder?: string
  contentRows?: number
  allowProgressiveDisclosure?: boolean
}

export function QuestionFormFields({
  register,
  errors,
  contentValue,
  titleValue = '',
  isSubmitting = false,
  showPreviewToggle = false,
  onTitleChange,
  titlePlaceholder,
  contentPlaceholder,
  contentRows = 8,
  allowProgressiveDisclosure = false,
}: QuestionFormFieldsProps) {
  const t = useTranslations('AskQuestionPage.QuestionForm.form');
  const [isPreview, setIsPreview] = useState(false)
  const [showDescription, setShowDescription] = useState(!allowProgressiveDisclosure)
  const [hasDescriptionContent, setHasDescriptionContent] = useState(false)

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { onChange } = register("content")
    onChange(e)
    setHasDescriptionContent(e.target.value.trim().length > 0)

    if (allowProgressiveDisclosure && e.target.value.trim().length === 0 && showDescription) {
      setShowDescription(false)
    }
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">{t('title')}</Label>
        <Textarea
          id="title"
          {...register("title")}
          onChange={onTitleChange}
          placeholder={titlePlaceholder || t('titlePlaceholder')}
          disabled={isSubmitting}
        />
        {allowProgressiveDisclosure && (
          <p className="text-sm text-muted-foreground">{t('titleHelper')}</p>
        )}
        {titleValue && (
          <Card className="p-3 bg-muted/30 border-dashed">
            <div className="text-xs text-muted-foreground mb-1">{t('titlePreview')}</div>
            <MathContent content={titleValue} className="text-sm" />
          </Card>
        )}
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {allowProgressiveDisclosure && !showDescription ? (
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowDescription(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('addDetails')}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="content">
              {t('description')}
              {allowProgressiveDisclosure && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => !hasDescriptionContent && setShowDescription(false)}
                  className="ml-2 p-1 h-auto text-muted-foreground hover:text-foreground"
                  disabled={hasDescriptionContent}
                >
                  {showDescription ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              )}
            </Label>
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
              onChange={handleDescriptionChange}
              placeholder={contentPlaceholder || t('descriptionPlaceholder')}
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
      )}

      {!showPreviewToggle && (
        <div className="space-y-2">
          <Label>{t('preview')}</Label>
          <Card className="p-4 bg-muted/50 min-h-[100px]">
            <MathContent content={contentValue || ""} />
          </Card>
        </div>
      )}
    </>
  )
} 
