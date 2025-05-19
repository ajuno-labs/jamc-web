'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StudentsList } from './StudentsList'

export function StudentsSection() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Students</CardTitle>
        <CardDescription>Manage and monitor student progress</CardDescription>
      </CardHeader>
      <CardContent>
        <StudentsList />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Export List</Button>
        <Button>Message All</Button>
      </CardFooter>
    </Card>
  )
} 