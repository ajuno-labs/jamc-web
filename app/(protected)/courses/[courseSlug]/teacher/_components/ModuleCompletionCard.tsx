'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function ModuleCompletionCard() {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Module Completion</CardTitle>
        <CardDescription>Progress through course modules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <div>Module 1: HTML Basics</div>
              <div className="font-medium">98%</div>
            </div>
            <Progress value={98} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <div>Module 2: CSS Fundamentals</div>
              <div className="font-medium">87%</div>
            </div>
            <Progress value={87} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <div>Module 3: JavaScript Intro</div>
              <div className="font-medium">76%</div>
            </div>
            <Progress value={76} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <div>Module 4: DOM Manipulation</div>
              <div className="font-medium">54%</div>
            </div>
            <Progress value={54} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <div>Module 5: API Integration</div>
              <div className="font-medium">23%</div>
            </div>
            <Progress value={23} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 