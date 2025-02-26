import { notFound } from "next/navigation"
import { Metadata } from "next"
import { auth } from "@/auth"
import Link from "next/link"
import { Book, Calendar, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import { getCourseById } from "../../_actions/course-actions"
import { checkEnrollmentStatus } from "../../_actions/enrollment-actions"
import { CourseWithRelations } from "@/lib/types/course"
import EnrollButton from "./_components/enroll-button"

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string, slug: string }
}): Promise<Metadata> {
  const course = await getCourseById(params.id)
  
  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    }
  }
  
  return {
    title: course.title,
    description: course.description,
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: { id: string, slug: string }
}) {
  const course = await getCourseById(params.id) as CourseWithRelations | null
  
  if (!course) {
    notFound()
  }
  
  // Verify that the slug matches the course slug
  if (course.slug !== params.slug) {
    notFound()
  }
  
  // Get current user session
  const session = await auth()
  const userId = session?.user?.id
  
  // Check if user is enrolled
  const enrollmentStatus = userId ? await checkEnrollmentStatus(course.id) : { isEnrolled: false };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course info */}
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
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <Card key={module.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">
                        {enrollmentStatus.isEnrolled ? (
                          <Link href={`/courses/${course.id}/${course.slug}/modules/${module.id}`} className="hover:underline">
                            Module {index + 1}: {module.title}
                          </Link>
                        ) : (
                          <>Module {index + 1}: {module.title}</>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{module.content.substring(0, 150)}...</p>
                      {!enrollmentStatus.isEnrolled && index === 0 && (
                        <p className="text-sm mt-2 italic">Enroll in this course to access all modules</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="questions">
              <div className="space-y-4">
                {course.questions.length > 0 ? (
                  course.questions.map((question) => (
                    <Card key={question.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          <a href={`/questions/${question.id}/${question.slug}`} className="hover:underline">
                            {question.title}
                          </a>
                        </CardTitle>
                        <CardDescription>
                          Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })} by {question.author.name || "Anonymous"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{question._count.answers} answers</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground">No questions related to this course yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Course Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col">
              <EnrollButton 
                courseId={course.id} 
                isEnrolled={enrollmentStatus.isEnrolled} 
                isLoggedIn={!!userId}
              />
              
              {enrollmentStatus.isEnrolled && course.modules.length > 0 && (
                <Link href={`/courses/${course.id}/${course.slug}/modules/${course.modules[0].id}`}>
                  <Button variant="outline" className="w-full">Continue Learning</Button>
                </Link>
              )}
              
              <Link href={`/questions/ask?courseId=${course.id}`}>
                <Button variant="outline" className="w-full">Ask a Question</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modules:</span>
                <span className="font-medium">{course.modules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions:</span>
                <span className="font-medium">{course.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 