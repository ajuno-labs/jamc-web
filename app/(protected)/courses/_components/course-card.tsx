"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Users } from "lucide-react"

export type CourseCardProps = {
  id: string
  title: string
  description: string
  slug: string
  author: {
    id: string
    name: string
    image: string | null
  }
  tags: {
    id: string
    name: string
  }[]
  lessonCount: number
  enrollmentCount: number
  createdAt: Date
}

export function CourseCard({
  id,
  title,
  description,
  slug,
  author,
  tags,
  lessonCount,
  enrollmentCount
}: CourseCardProps) {
  return (
    <Link href={`/courses/${slug}`} key={id}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="flex items-center">
              <Book className="h-4 w-4 mr-1" />
              {lessonCount} lessons
            </span>
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {enrollmentCount} enrolled
            </span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <div className="flex items-center">
              {author.image ? (
                <Image 
                  src={author.image} 
                  alt={author.name} 
                  width={20} 
                  height={20} 
                  className="rounded-full mr-2"
                />
              ) : (
                <Users className="h-4 w-4 mr-1" />
              )}
              {author.name}
            </div>
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {tags.slice(0, 3).map(tag => (
                <span key={tag.id} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {tag.name}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
} 