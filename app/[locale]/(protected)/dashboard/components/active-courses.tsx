"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface Course {
  name: string;
  progress: number;
  color: string;
}

interface ActiveCoursesProps {
  courses: Course[];
}

export default function ActiveCourses({ courses }: ActiveCoursesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Active Courses
        </CardTitle>
        <CardDescription>Your current course progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{course.name}</span>
              <span className="text-sm text-muted-foreground">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
