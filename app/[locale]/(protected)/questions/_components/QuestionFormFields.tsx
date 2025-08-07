"use client"

import { useState } from "react"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { QuestionType, Visibility } from "@prisma/client"
import { useTranslations } from "next-intl"
import { QuestionFormTab } from "./QuestionFormTab"
import { QuestionPreviewTab } from "./QuestionPreviewTab"

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
    <Tabs defaultValue="form" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="form">{t('formTab')}</TabsTrigger>
        <TabsTrigger value="preview">{t('previewTab')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="form" className="mt-4">
        <QuestionFormTab
          register={register}
          errors={errors}
          onTitleChange={onTitleChange}
          titlePlaceholder={titlePlaceholder}
          contentPlaceholder={contentPlaceholder}
          contentRows={contentRows}
          isSubmitting={isSubmitting}
          allowProgressiveDisclosure={allowProgressiveDisclosure}
          showDescription={showDescription}
          setShowDescription={setShowDescription}
          hasDescriptionContent={hasDescriptionContent}
          handleDescriptionChange={handleDescriptionChange}
        />
      </TabsContent>

      <TabsContent value="preview" className="mt-4">
        <QuestionPreviewTab
          titleValue={titleValue}
          contentValue={contentValue || ""}
          showDescription={showDescription}
        />
      </TabsContent>
    </Tabs>
  )
} 
