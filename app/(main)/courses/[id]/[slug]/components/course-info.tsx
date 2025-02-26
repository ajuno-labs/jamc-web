"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Book, Calendar, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { CourseWithRelations } from "@/lib/types/course"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseModules from "./course-modules"
import CourseQuestions from "./course-questions"

interface CourseInfoProps {
  course: CourseWithRelations
  isEnrolled: boolean
}

export default function CourseInfo({ course, isEnrolled }: CourseInfoProps) {
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
      
      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>{course.modules.length} modules</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>{course.questions.length} questions</span>
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
      
      <Tabs defaultValue="modules" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="questions">Related Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules">
          <CourseModules
            modules={course.modules}
            courseId={course.id}
            courseSlug={course.slug}
            isEnrolled={isEnrolled}
          />
        </TabsContent>
        
        <TabsContent value="questions">
          <CourseQuestions questions={course.questions} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 