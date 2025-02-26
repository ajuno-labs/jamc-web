"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ModuleNavigationProps {
  modules: Array<{
    id: string
    title: string
  }>
  currentModuleId: string
  courseId: string
  courseSlug: string
}

export function ModuleNavigation({
  modules,
  currentModuleId,
  courseId,
  courseSlug
}: ModuleNavigationProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Module Navigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {modules.map((module, index) => (
          <Link 
            key={module.id} 
            href={`/courses/${courseId}/${courseSlug}/modules/${module.id}`}
            className={`block p-2 rounded-md ${
              module.id === currentModuleId 
                ? 'bg-muted font-medium' 
                : 'hover:bg-muted/50'
            }`}
          >
            Module {index + 1}: {module.title}
          </Link>
        ))}
      </CardContent>
    </Card>
  )
} 