"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getContributionStatsAction } from "@/lib/actions/contribution-actions";
import { Flame, Award, Calendar, Zap } from "lucide-react";

interface ContributionStatsProps {
  userId?: string;
}

interface UserContributionStats {
  totalPoints: number;
  totalQuestions: number;
  totalAnswers: number;
  totalLessonsViewed: number;
  currentStreak: number;
  longestStreak: number;
  totalContributionDays: number;
}

export function ContributionStats({ userId }: ContributionStatsProps) {
  const [stats, setStats] = useState<UserContributionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const result = await getContributionStatsAction(userId);
        if (result.success) {
          setStats(result.data);
        } else {
          setError(result.error || "Failed to load contribution stats");
        }
      } catch (err) {
        setError("Failed to load contribution stats");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            {error || "No contribution data available"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      icon: Zap,
      label: "Total Points",
      value: stats.totalPoints,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${stats.currentStreak} day${stats.currentStreak !== 1 ? "s" : ""}`,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: Award,
      label: "Longest Streak",
      value: `${stats.longestStreak} day${stats.longestStreak !== 1 ? "s" : ""}`,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Calendar,
      label: "Active Days",
      value: `${stats.totalContributionDays} day${stats.totalContributionDays !== 1 ? "s" : ""}`,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Contribution Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${item.bgColor}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${item.color}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              <Badge variant="secondary" className="font-semibold">
                {item.value}
              </Badge>
            </div>
          );
        })}

        {/* Activity Breakdown */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-sm text-muted-foreground">Activity Breakdown</h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Questions:</span>
              <span className="font-medium">{stats.totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Answers:</span>
              <span className="font-medium">{stats.totalAnswers}</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-muted-foreground">Lessons Viewed:</span>
              <span className="font-medium">{stats.totalLessonsViewed}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}