"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

interface Deadline {
  title: string;
  dueDate: string;
  urgency: "high" | "medium" | "low";
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

export default function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const t = useTranslations("Dashboard.deadlines");

  const getDeadlineStyles = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-50 border border-red-200";
      case "medium":
        return "bg-yellow-50 border border-yellow-200";
      case "low":
        return "bg-green-50 border border-green-200";
      default:
        return "bg-gray-50 border border-gray-200";
    }
  };

  const getTextStyles = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-800";
      case "medium":
        return "text-yellow-800";
      case "low":
        return "text-green-800";
      default:
        return "text-gray-800";
    }
  };

  const getSubTextStyles = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deadlines.map((deadline, index) => (
            <div key={index} className={`p-3 rounded-lg ${getDeadlineStyles(deadline.urgency)}`}>
              <p className={`text-sm font-medium ${getTextStyles(deadline.urgency)}`}>
                {deadline.title}
              </p>
              <p className={`text-xs ${getSubTextStyles(deadline.urgency)}`}>{deadline.dueDate}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
