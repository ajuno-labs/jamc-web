"use client"

import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MathContent } from "@/components/MathContent"
import { useTranslations } from "next-intl"

interface QuestionPreviewTabProps {
  titleValue: string
  contentValue: string
  showDescription: boolean
}

export function QuestionPreviewTab({
  titleValue,
  contentValue,
  showDescription,
}: QuestionPreviewTabProps) {
  const t = useTranslations('AskQuestionPage.QuestionForm.form')

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-muted-foreground">{t('titlePreview')}</Label>
        <Card className="p-4 bg-muted/50 min-h-[60px] mt-2">
          {titleValue ? (
            <MathContent content={titleValue} className="font-semibold text-lg" />
          ) : (
            <p className="text-muted-foreground italic">{t('noTitleContent')}</p>
          )}
        </Card>
      </div>
      
      {(showDescription || contentValue) && (
        <div>
          <Label className="text-sm font-medium text-muted-foreground">{t('contentPreview')}</Label>
          <Card className="p-4 bg-muted/50 min-h-[100px] mt-2">
            {contentValue ? (
              <MathContent content={contentValue} />
            ) : (
              <p className="text-muted-foreground italic">{t('noContentPreview')}</p>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}