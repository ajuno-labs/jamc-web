'use client'

import Link from 'next/link'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'

interface QuestionItem {
  id: string
  content: string
  slug: string
  createdAt: string
  author: {
    id: string
    name: string
  }
  _count: {
    answers: number
  }
}

interface TeacherDashboardTableProps {
  questions: QuestionItem[]
}

export default function TeacherDashboardTable({ questions }: TeacherDashboardTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Question</TableHead>
          <TableHead className="text-center">Answers</TableHead>
          <TableHead>Asked At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((q) => (
          <TableRow key={q.id}>
            <TableCell>{q.author.name}</TableCell>
            <TableCell>
              <Link href={`/questions/${q.id}/${q.slug}`} className="hover:underline">
                {q.content.length > 50 ? `${q.content.slice(0, 50)}...` : q.content}
              </Link>
            </TableCell>
            <TableCell className="text-center">{q._count.answers}</TableCell>
            <TableCell>{new Date(q.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 