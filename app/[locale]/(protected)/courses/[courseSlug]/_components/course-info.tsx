"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Book, Calendar, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseQuestions from "./course-questions"

interface CourseInfoProps {
  course: {
    id: string
    title: string
    description: string
    slug: string
    createdAt: Date
    lessons: {
      id: string
      title: string
      slug: string
      order: number
    }[]
    tags: {
      id: string
      name: string
    }[]
    author: {
      name: string | null
      image: string | null
    }
    questions: {
      id: string
      title: string
      createdAt: Date
      slug: string
      author: {
        name: string | null
        image: string | null
      }
      _count: {
        answers: number
        votes: number
      }
    }[]
  }
}

export default function CourseInfo({ course }: CourseInfoProps) {
  return (
    <div className="lg:col-span-2">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {course.tags.map((tag) => (
          <Badge key={tag.id} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>
      
      <p className="text-muted-foreground mb-6">{course.description}</p>
      
      <div className="flex items-center gap-6 mb-8 flex-wrap">
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>{course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>{course.questions.length} question{course.questions.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>Created {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}</span>
        </div>
      </div>
      
      <div className="flex items-center mb-8">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={course.author.image || undefined} alt={course.author.name || "Author"} />
          <AvatarFallback>{course.author.name?.charAt(0) || "A"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{course.author.name || "Anonymous"}</p>
          <p className="text-sm text-muted-foreground">Course Instructor</p>
        </div>
      </div>
      
      <Tabs defaultValue="questions" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="questions">Related Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions">
          <CourseQuestions questions={course.questions} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 