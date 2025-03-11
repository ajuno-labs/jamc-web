"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Book, Calendar, MessageSquare, BookOpen } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { CourseWithRelations } from "@/lib/types/course"
import { CourseWithStructure } from "@/lib/types/course-structure"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseModules from "./course-modules"
import CourseQuestions from "./course-questions"

interface CourseInfoProps {
  course: CourseWithRelations | CourseWithStructure
  isEnrolled: boolean
}

export default function CourseInfo({ course, isEnrolled }: CourseInfoProps) {
  // Check if the course has the new structure (volumes)
  const hasNewStructure = 'volumes' in course && course.volumes.length > 0
  
  // Calculate module count based on structure
  const moduleCount = hasNewStructure 
    ? (course as CourseWithStructure).volumes.reduce((acc, vol) => 
        acc + vol.chapters.reduce((acc2, chap) => acc2 + (chap.modules?.length || 0), 0), 0)
    : (course as CourseWithRelations).modules?.length || 0
  
  // Calculate volume and chapter counts
  const volumeCount = hasNewStructure ? (course as CourseWithStructure).volumes.length : 0
  const chapterCount = hasNewStructure 
    ? (course as CourseWithStructure).volumes.reduce((acc, vol) => acc + vol.chapters.length, 0)
    : 0
  
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
        {hasNewStructure && (
          <>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{volumeCount} volume{volumeCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <Book className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{chapterCount} chapter{chapterCount !== 1 ? 's' : ''}</span>
            </div>
          </>
        )}
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>{moduleCount} module{moduleCount !== 1 ? 's' : ''}</span>
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
      
      {!hasNewStructure && (
        <Tabs defaultValue="modules" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="questions">Related Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules">
            <CourseModules
              modules={(course as CourseWithRelations).modules}
              courseId={course.id}
              courseSlug={course.slug}
              isEnrolled={isEnrolled}
            />
          </TabsContent>
          
          <TabsContent value="questions">
            <CourseQuestions questions={course.questions} />
          </TabsContent>
        </Tabs>
      )}
      
      {hasNewStructure && (
        <Tabs defaultValue="questions" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="questions">Related Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions">
            <CourseQuestions questions={course.questions} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 