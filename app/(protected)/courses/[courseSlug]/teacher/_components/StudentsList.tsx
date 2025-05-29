'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import type { CourseActivitySummary } from '@/lib/types/student-activity'
import { getCourseStudentsList } from '../_actions/student-activity-actions'

interface StudentsListProps {
  currentCourseSlug: string
  activitySummary: CourseActivitySummary
}

interface StudentData {
  id: string
  name: string
  email: string
  image: string | null
  lastActivityAt: Date | null
  activityState: 'active' | 'at-risk' | 'inactive'
  questionsAsked: number
  progress: number
}

export function StudentsList({ currentCourseSlug, activitySummary }: StudentsListProps) {
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStudents() {
      try {
        const studentData = await getCourseStudentsList(currentCourseSlug)
        setStudents(studentData)
      } catch (error) {
        console.error('Failed to fetch students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [currentCourseSlug])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatLastActive = (lastActivityAt: Date | null) => {
    if (!lastActivityAt) return 'Never'
    
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - lastActivityAt.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const getStatusBadge = (state: 'active' | 'at-risk' | 'inactive') => {
    switch (state) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'at-risk':
        return <Badge variant="destructive">At Risk</Badge>
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading students...</div>
  }

  if (students.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No students enrolled yet.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>
            <Button variant="ghost" size="sm" className="gap-1 font-medium">
              Progress
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </TableHead>
          <TableHead>Questions</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student.image || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-xs text-muted-foreground">{student.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={student.progress} className="h-2 w-24" />
                <span className="text-xs font-medium">{student.progress}%</span>
              </div>
            </TableCell>
            <TableCell>{student.questionsAsked}</TableCell>
            <TableCell>{formatLastActive(student.lastActivityAt)}</TableCell>
            <TableCell>
              {getStatusBadge(student.activityState)}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                  <DropdownMenuItem>View Questions</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
