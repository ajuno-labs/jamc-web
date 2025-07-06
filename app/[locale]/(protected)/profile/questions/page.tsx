import { Link } from "@/i18n/navigation"
import { getAllUserQuestions } from "../_actions/profile-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AllQuestionsPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1
  
  const questionsData = await getAllUserQuestions(page, 10)
  
  if (!questionsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load your questions.</p>
        </div>
      </div>
    )
  }
  
  const { questions, pagination } = questionsData
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Questions</h1>
            <p className="text-muted-foreground">
              {pagination.totalCount} questions total
            </p>
          </div>
          
          <Button asChild>
            <Link href="/questions/ask">Ask New Question</Link>
          </Button>
        </div>
      </div>
      
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      <Link 
                        href={`/questions/${question.id}/${question.slug}`}
                        className="hover:underline"
                      >
                        {question.title}
                      </Link>
                    </CardTitle>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{question.type}</Badge>
                      <Badge 
                        variant={question.status === 'OPEN' ? 'default' : 'secondary'}
                      >
                        {question.status}
                      </Badge>
                      
                      {question.course && (
                        <Badge variant="secondary">
                          <Link 
                            href={`/courses/${question.course.slug}`}
                            className="hover:underline"
                          >
                            {question.course.title}
                          </Link>
                        </Badge>
                      )}
                      
                      {question.lesson && (
                        <Badge variant="outline">
                          <Link 
                            href={`/courses/${question.course?.slug}/lessons/${question.lesson.id}/${question.lesson.slug}`}
                            className="hover:underline"
                          >
                            {question.lesson.title}
                          </Link>
                        </Badge>
                      )}
                    </div>
                    
                    <CardDescription>
                      Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.answerCount} answers</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{question.voteCount} votes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {pagination.hasPrev && (
                <Button variant="outline" asChild>
                  <Link href={`/profile/questions?page=${page - 1}`}>
                    Previous
                  </Link>
                </Button>
              )}
              
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              {pagination.hasNext && (
                <Button variant="outline" asChild>
                  <Link href={`/profile/questions?page=${page + 1}`}>
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven&apos;t asked any questions. Start by asking your first question!
            </p>
            <Button asChild>
              <Link href="/questions/ask">Ask Your First Question</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
