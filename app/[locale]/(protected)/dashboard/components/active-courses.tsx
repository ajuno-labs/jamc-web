"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

interface Course {
  name: string;
  progress: number;
  color: string;
}

interface ActiveCoursesProps {
  courses: Course[];
}

export default function ActiveCourses({ courses }: ActiveCoursesProps) {
  const t = useTranslations("Dashboard.courses");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{course.name}</span>
              <span className="text-sm text-muted-foreground">
                {t("progress", { progress: course.progress })}
              </span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
