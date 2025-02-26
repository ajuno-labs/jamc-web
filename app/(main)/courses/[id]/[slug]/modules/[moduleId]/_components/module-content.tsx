"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ModuleContentProps {
  content: string
}

export function ModuleContent({ content }: ModuleContentProps) {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        {/* This would ideally be rendered Markdown/LaTeX content */}
        <div className="prose dark:prose-invert max-w-none">
          {content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 