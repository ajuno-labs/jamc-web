import Link from "next/link";
import { getUserProfile } from "./_actions/profile-actions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import type { ProfileQuestion, ProfileAnswer } from "@/lib/types/profile";

export default async function ProfilePage() {
  const profileData = await getUserProfile();

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  const { user, questions, answers, stats } = profileData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center space-y-2">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>

              <CardTitle className="text-2xl">
                {user.name || "Anonymous User"}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>

              <div className="flex flex-wrap gap-2 justify-center">
                {user.roles.map(
                  (role: { name: string; permissions: string[] }) => (
                    <Badge key={role.name} variant="secondary">
                      {role.name}
                    </Badge>
                  )
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Reputation</span>
                <div className="text-right">
                  <span className="font-semibold">
                    {stats.reputation} points
                  </span>
                  {stats.reputationBreakdown && (
                    <div className="text-xs text-muted-foreground">
                      <div>
                        Questions: +
                        {stats.reputationBreakdown.fromQuestionVotes +
                          stats.reputationBreakdown.fromQuestionsPosted}
                      </div>
                      <div>
                        Answers: +
                        {stats.reputationBreakdown.fromAnswerVotes +
                          stats.reputationBreakdown.fromAnswersPosted}
                      </div>
                      <div>
                        Accepted: +
                        {stats.reputationBreakdown.fromAcceptedAnswers}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Questions</span>
                <span className="font-semibold">{stats.totalQuestions}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Answers</span>
                <span className="font-semibold">{stats.totalAnswers}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-semibold">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Badges Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Achievements you&apos;ve earned</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
                <p className="text-muted-foreground">
                  You haven&apos;t earned any badges yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Continue participating to earn badges!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>Topics and questions you follow</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
                <p className="text-muted-foreground">
                  You&apos;re not following any topics yet.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/explore">Explore Topics</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Questions Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Questions</CardTitle>
                <CardDescription>Questions you&apos;ve asked</CardDescription>
              </div>
              {stats.totalQuestions > 0 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile/questions">View All</Link>
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question: ProfileQuestion) => (
                    <div key={question.id} className="space-y-2">
                      <Link
                        href={`/questions/${question.id}/${question.slug}`}
                        className="text-lg font-medium hover:underline"
                      >
                        {question.title}
                      </Link>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(question.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{question.answerCount} answers</span>
                        <span className="mx-2">•</span>
                        <span>{question.voteCount} votes</span>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
                  <p className="text-muted-foreground">
                    You haven&apos;t asked any questions yet.
                  </p>
                  <Button asChild>
                    <Link href="/questions/ask">Ask a Question</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Answers Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Answers</CardTitle>
                <CardDescription>Answers you&apos;ve provided</CardDescription>
              </div>
              {stats.totalAnswers > 0 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile/answers">View All</Link>
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {answers.length > 0 ? (
                <div className="space-y-4">
                  {answers.map((answer: ProfileAnswer) => (
                    <div key={answer.id} className="space-y-2">
                      <div>
                        <Link
                          href={`/questions/${answer.questionId}/${answer.questionSlug}`}
                          className="text-lg font-medium hover:underline"
                        >
                          {answer.questionTitle}
                        </Link>
                        {answer.isAccepted && (
                          <Badge className="ml-2" variant="default">
                            Accepted
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {answer.content}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(answer.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
                  <p className="text-muted-foreground">
                    You haven&apos;t answered any questions yet.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/questions">Browse Questions</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Recent activity on your content</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
                <p className="text-muted-foreground">
                  You have no new notifications.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
