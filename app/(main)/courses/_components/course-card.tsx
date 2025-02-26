"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Users, MessageSquare } from "lucide-react"

export type CourseCardProps = {
  id: string
  title: string
  description: string
  slug: string
  modules: number
  questions: number
  topics: string[]
  teacher: string
  teacherId: string
  teacherImage: string | null
}

export function CourseCard({
  id,
  title,
  description,
  slug,
  modules,
  questions,
  topics,
  teacher,
  teacherImage
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}/${slug}`} key={id}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="flex items-center">
              <Book className="h-4 w-4 mr-1" />
              {modules} modules
            </span>
            <span className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {questions} questions
            </span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <div className="flex items-center">
              {teacherImage ? (
                <Image 
                  src={teacherImage} 
                  alt={teacher} 
                  width={20} 
                  height={20} 
                  className="rounded-full mr-2"
                />
              ) : (
                <Users className="h-4 w-4 mr-1" />
              )}
              {teacher}
            </div>
          </div>
          {topics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {topics.slice(0, 3).map(topic => (
                <span key={topic} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {topic}
                </span>
              ))}
              {topics.length > 3 && (
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  +{topics.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
} 