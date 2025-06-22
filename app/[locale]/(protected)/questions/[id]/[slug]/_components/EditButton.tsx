"use client"

import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface EditButtonProps {
  onClick: () => void
  className?: string
}

export function EditButton({ onClick, className = "" }: EditButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`text-muted-foreground hover:text-foreground ${className}`}
    >
      <Edit className="h-4 w-4" />
    </Button>
  )
} 