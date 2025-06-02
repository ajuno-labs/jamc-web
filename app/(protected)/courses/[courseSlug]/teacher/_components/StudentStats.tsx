'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Student {
  id: string
  name: string
}

interface StudentStatsProps {
  students: Student[]
}

export default function StudentStats({ students }: StudentStatsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Enrolled Students ({students.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-1">
          {students.map((student) => (
            <li key={student.id}>{student.name}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
} 