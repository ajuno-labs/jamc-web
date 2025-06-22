import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { LessonCardProps } from "@/lib/types/course-structure";

export function LessonCard({
  id,
  title,
  slug,
  activityCount,
  summary,
  courseId,
  courseTitle,
  courseSlug,
}: LessonCardProps) {
  // Direct course lesson URL
  const lessonUrl = `/courses/${courseSlug}/lessons/${id}/${slug}`;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link
            href={lessonUrl}
            className="hover:text-primary transition-colors"
          >
            {title}
          </Link>
        </CardTitle>
        <CardDescription className="flex flex-col">
          <Link
            href={`/courses/${courseId}/${courseSlug}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {courseTitle}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">
          {summary
            ? summary.length > 100
              ? summary.slice(0, 100) + "..."
              : summary
            : "No summary available."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-1 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>
            {activityCount} {activityCount === 1 ? "Activity" : "Activities"}
          </span>
        </div>
        <Badge variant="outline">Lesson</Badge>
      </CardFooter>
    </Card>
  );
}
