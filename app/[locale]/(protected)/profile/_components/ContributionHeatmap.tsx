"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { getContributionHeatmapAction } from "@/lib/actions/contribution-actions";

interface HeatmapData {
  date: string;
  count: number;
  level: number;
}

interface ContributionHeatmapProps {
  userId?: string;
}

export function ContributionHeatmap({ userId }: ContributionHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeatmapData() {
      try {
        setLoading(true);
        const result = await getContributionHeatmapAction(userId);
        if (result.success && result.data) {
          setHeatmapData(result.data);
        } else {
          setError(result.error || "Failed to load contribution data");
        }
      } catch (err) {
        setError("Failed to load contribution data");
        console.error("Error fetching heatmap:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHeatmapData();
  }, [userId]);

  const generateYearDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  // Create a map for quick lookup
  const heatmapMap = new Map(heatmapData.map(item => [item.date, item]));
  const yearDates = generateYearDates();

  // Get level color classes
  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-gray-100 dark:bg-gray-800";
      case 1: return "bg-green-200 dark:bg-green-900";
      case 2: return "bg-green-300 dark:bg-green-700";
      case 3: return "bg-green-400 dark:bg-green-600";
      case 4: return "bg-green-500 dark:bg-green-500";
      default: return "bg-gray-100 dark:bg-gray-800";
    }
  };

  // Format date for tooltip
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group dates by weeks for proper layout
  const groupByWeeks = (dates: string[]) => {
    const weeks = [];
    let currentWeek = [];
    
    // Fill in empty days at the start to align with Sunday
    const firstDate = new Date(dates[0]);
    const firstDayOfWeek = firstDate.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (const date of dates) {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill the last week if needed
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const weeks = groupByWeeks(yearDates);
  const totalContributions = heatmapData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Activity</CardTitle>
        <div className="text-sm text-muted-foreground">
          {totalContributions} contributions in the last year
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <TooltipProvider>
            <div className="overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((date, dayIndex) => {
                      if (!date) {
                        return <div key={dayIndex} className="w-3 h-3" />;
                      }

                      const data = heatmapMap.get(date);
                      const level = data?.level || 0;
                      const count = data?.count || 0;

                      return (
                        <Tooltip key={date}>
                          <TooltipTrigger>
                            <div
                              className={`w-3 h-3 rounded-sm border border-gray-200 dark:border-gray-700 ${getLevelColor(level)}`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">
                                {count} {count === 1 ? "contribution" : "contributions"}
                              </div>
                              <div className="text-muted-foreground">
                                {formatDate(date)}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </TooltipProvider>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm border border-gray-200 dark:border-gray-700 ${getLevelColor(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
