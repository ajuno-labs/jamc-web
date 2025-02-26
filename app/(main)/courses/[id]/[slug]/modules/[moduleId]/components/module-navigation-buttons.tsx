"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ModuleNavigationButtonsProps {
  prevModule: { id: string; title: string } | null
  nextModule: { id: string; title: string } | null
  courseId: string
  courseSlug: string
}

export function ModuleNavigationButtons({
  prevModule,
  nextModule,
  courseId,
  courseSlug
}: ModuleNavigationButtonsProps) {
  return (
    <div className="flex justify-between mb-8">
      {prevModule ? (
        <Link href={`/courses/${courseId}/${courseSlug}/modules/${prevModule.id}`}>
          <Button variant="outline" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous: {prevModule.title}
          </Button>
        </Link>
      ) : (
        <div></div>
      )}
      
      {nextModule ? (
        <Link href={`/courses/${courseId}/${courseSlug}/modules/${nextModule.id}`}>
          <Button variant="outline" className="flex items-center">
            Next: {nextModule.title}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  )
} 