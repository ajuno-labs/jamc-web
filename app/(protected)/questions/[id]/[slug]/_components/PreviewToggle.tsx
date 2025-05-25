"use client"

import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface PreviewToggleProps {
  isPreview: boolean
  onToggle: () => void
  className?: string
}

export function PreviewToggle({ isPreview, onToggle, className = "" }: PreviewToggleProps) {
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
          Edit
        </>
      ) : (
        <>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </>
      )}
    </Button>
  )
} 