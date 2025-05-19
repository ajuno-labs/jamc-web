'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { WeeklyActivityChart } from './WeeklyActivityChart'

export function WeeklyActivityCard() {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
        <CardDescription>Student logins and engagement over time</CardDescription>
      </CardHeader>
      <CardContent>
        <WeeklyActivityChart />
      </CardContent>
    </Card>
  )
} 