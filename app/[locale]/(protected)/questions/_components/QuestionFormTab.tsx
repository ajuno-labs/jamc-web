"use client"

import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { QuestionType, Visibility } from "@prisma/client"
import { useTranslations } from "next-intl"
import { Plus, ChevronDown, ChevronUp } from "lucide-react"

interface FormData {
  title: string
  content: string
  type: QuestionType
  visibility: Visibility
}

interface QuestionFormTabProps {
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  titlePlaceholder?: string
  contentPlaceholder?: string
  contentRows?: number
  isSubmitting?: boolean
  allowProgressiveDisclosure?: boolean
  showDescription: boolean
  setShowDescription: (show: boolean) => void
  hasDescriptionContent: boolean
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function QuestionFormTab({
  register,
  errors,
  onTitleChange,
  titlePlaceholder,
  contentPlaceholder,
  contentRows = 8,
  isSubmitting = false,
  allowProgressiveDisclosure = false,
  showDescription,
  setShowDescription,
  hasDescriptionContent,
  handleDescriptionChange,
}: QuestionFormTabProps) {
  const t = useTranslations('AskQuestionPage.QuestionForm.form')

  return (
    <div className="space-y-6">
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
          </div>
          
          <Textarea
            id="content"
            {...register("content")}
            onChange={handleDescriptionChange}
            placeholder={contentPlaceholder || t('descriptionPlaceholder')}
            rows={contentRows}
            disabled={isSubmitting}
          />
          {errors.content && (
            <p className="text-sm text-destructive">
              {errors.content.message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}