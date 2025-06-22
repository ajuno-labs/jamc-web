"use client"

import Link from "next/link";
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
import { formatDistanceToNow } from "date-fns";

interface UserInfoCardProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
    roles: Array<{
      name: string;
      permissions: string[];
    }>;
  };
  stats: {
    reputation: number;
    totalQuestions: number;
    totalAnswers: number;
    reputationBreakdown?: {
      fromQuestionVotes: number;
      fromQuestionsPosted: number;
      fromAnswerVotes: number;
      fromAnswersPosted: number;
      fromAcceptedAnswers: number;
    };
  };
}

export function UserInfoCard({ user, stats }: UserInfoCardProps) {
  return (
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
          {user.roles.map((role) => (
            <Badge key={role.name} variant="secondary">
              {role.name}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-muted-foreground">Reputation</span>
          <div className="text-right">
            <span className="font-semibold">{stats.reputation} points</span>
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
                  Accepted: +{stats.reputationBreakdown.fromAcceptedAnswers}
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
  );
} 