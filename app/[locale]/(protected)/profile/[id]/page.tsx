import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { calculateUserReputation } from "@/lib/utils/reputation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/navigation"

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id: userId } = await params

  if (!userId || typeof userId !== 'string') {
    notFound()
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      roles: {
        include: {
          permissions: true
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  // Calculate user statistics
  const [reputation, questionCount, answerCount] = await Promise.all([
    calculateUserReputation(userId),
    prisma.question.count({ where: { authorId: userId } }),
    prisma.answer.count({ where: { authorId: userId } })
  ])

  // Get recent questions
  const recentQuestions = await prisma.question.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      _count: {
        select: {
          answers: true,
          votes: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  // Get recent answers
  const recentAnswers = await prisma.answer.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      isAcceptedByUser: true,
      isAcceptedByTeacher: true,
      question: {
        select: {
          id: true,
          title: true,
          slug: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={user.image || undefined} alt={user.name || undefined} />
                <AvatarFallback className="text-2xl">{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{reputation}</div>
                  <div className="text-sm text-muted-foreground">Reputation</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{questionCount}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{answerCount}</div>
                  <div className="text-sm text-muted-foreground">Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {new Date(user.createdAt).getFullYear()}
                  </div>
                  <div className="text-sm text-muted-foreground">Member since</div>
                </div>
              </div>
              
              {/* Roles */}
              {user.roles.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <Badge key={role.id} variant="secondary">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentQuestions.length > 0 ? (
                <div className="space-y-4">
                  {recentQuestions.map((question) => (
                    <div key={question.id} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-medium hover:text-primary">
                        <Link href={`/questions/${question.id}/${question.slug}`}>
                          {question.title}
                        </Link>
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                        <span>{question._count.answers} answers</span>
                        <span>{question._count.votes} votes</span>
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No questions yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Answers */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Answers</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAnswers.length > 0 ? (
                <div className="space-y-4">
                  {recentAnswers.map((answer) => (
                    <div key={answer.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium hover:text-primary">
                            <Link href={`/questions/${answer.question.id}/${answer.question.slug}`}>
                              {answer.question.title}
                            </Link>
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {answer.content.substring(0, 150)}
                            {answer.content.length > 150 ? '...' : ''}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(answer.createdAt).toLocaleDateString()}
                            </span>
                            {(answer.isAcceptedByUser || answer.isAcceptedByTeacher) && (
                              <Badge variant="default" className="text-xs">
                                Accepted
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No answers yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 