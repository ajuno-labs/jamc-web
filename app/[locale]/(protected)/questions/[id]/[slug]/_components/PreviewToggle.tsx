"use client"

import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useTranslations } from "next-intl"

interface PreviewToggleProps {
  isPreview: boolean
  onToggle: () => void
  className?: string
}

export function PreviewToggle({ isPreview, onToggle, className = "" }: PreviewToggleProps) {
  const t = useTranslations("PreviewToggle")
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onToggle}
      className={className}
    >
      {isPreview ? (
        <>
          <EyeOff className="h-4 w-4 mr-2" />
          {t('edit')}
        </>
      ) : (
        <>
          <Eye className="h-4 w-4 mr-2" />
          {t('preview')}
        </>
      )}
    </Button>
  )
} 