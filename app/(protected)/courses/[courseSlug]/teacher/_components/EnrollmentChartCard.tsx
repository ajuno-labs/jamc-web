'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { EnrollmentChart } from './EnrollmentChart'
import type { EnrollmentTrendData } from '@/lib/types/dashboard'

interface EnrollmentChartCardProps {
  data: EnrollmentTrendData[]
}

export function EnrollmentChartCard({ data }: EnrollmentChartCardProps) {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Student Enrollment</CardTitle>
        <CardDescription>New enrollments and student activity</CardDescription>
      </CardHeader>
      <CardContent>
        <EnrollmentChart data={data} />
      </CardContent>
    </Card>
  )
} 