'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { ModuleProgressData } from '@/lib/types/dashboard'

interface ModuleCompletionCardProps {
  data: ModuleProgressData[]
}

export function ModuleCompletionCard({ data }: ModuleCompletionCardProps) {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Module Completion</CardTitle>
        <CardDescription>Progress through course modules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length === 0 ? (
            <div className="text-sm text-muted-foreground">No modules found</div>
          ) : (
            data.map((moduleData) => (
              <div key={moduleData.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="truncate">{moduleData.title}</div>
                  <div className="font-medium">{moduleData.completionPercentage}%</div>
                </div>
                <Progress value={moduleData.completionPercentage} className="h-2" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 