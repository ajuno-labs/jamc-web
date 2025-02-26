"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type Topic = {
  name: string
  count: number
}

export type Teacher = {
  id: string
  name: string
  image: string | null
  courseCount: number
}

interface CourseFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  topicFilter: string
  setTopicFilter: (value: string) => void
  teacherFilter: string
  setTeacherFilter: (value: string) => void
  topics: Topic[]
  teachers: Teacher[]
}

export function CourseFilters({
  searchTerm,
  setSearchTerm,
  topicFilter,
  setTopicFilter,
  teacherFilter,
  setTeacherFilter,
  topics,
  teachers
}: CourseFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Input 
        placeholder="Search courses..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <Select value={topicFilter} onValueChange={setTopicFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by topic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Topics</SelectItem>
          {topics.map((topic) => (
            <SelectItem key={topic.name} value={topic.name}>
              {topic.name} ({topic.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={teacherFilter} onValueChange={setTeacherFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by teacher" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Teachers</SelectItem>
          {teachers.map((teacher) => (
            <SelectItem key={teacher.id} value={teacher.id}>
              {teacher.name} ({teacher.courseCount})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 