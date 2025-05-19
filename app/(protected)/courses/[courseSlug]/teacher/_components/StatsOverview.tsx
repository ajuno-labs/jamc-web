'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface StatsOverviewProps {
  studentsCount: number
  newThisWeekCount: number
  activeStudentsCount: number
  activeStudentsPercentage: number
  openQuestionsCount: number
  unansweredCount: number
  averageCompletion: number
}

export function StatsOverview({
  studentsCount,
  newThisWeekCount,
  activeStudentsCount,
  activeStudentsPercentage,
  openQuestionsCount,
  unansweredCount,
  averageCompletion,
}: StatsOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studentsCount}</div>
          <p className="text-xs text-muted-foreground">+{newThisWeekCount} new this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Students (7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeStudentsCount}</div>
          <p className="text-xs text-muted-foreground">{activeStudentsPercentage}% of total students</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Open Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openQuestionsCount}</div>
          <p className="text-xs text-muted-foreground">{unansweredCount} unanswered</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageCompletion}%</div>
          <Progress value={averageCompletion} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  )
} 