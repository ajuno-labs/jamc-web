import { Link } from "@/i18n/navigation";
import { Clock, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { LessonSummary } from "../_actions/summary-actions";

interface LessonSummaryHeaderProps {
  lesson: NonNullable<LessonSummary>;
  nextLessonUrl?: string;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function LessonSummaryHeader({
  lesson,
}: LessonSummaryHeaderProps) {
  const author = lesson.course.author!;
  const metadata = (lesson.metadata ?? {}) as {
    duration?: string;
    instructorRole?: string;
  };
  const duration = metadata.duration;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/courses" className="hover:underline">
          Courses
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/courses/${lesson.course.slug}`}
          className="hover:underline"
        >
          {lesson.course.title}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>Lesson {lesson.order}</span>
      </div>

      <h1 className="text-3xl font-bold">{lesson.title}</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={author.image ?? "/placeholder.svg"}
              alt={author.name!}
            />
            <AvatarFallback>{author.name!.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{author.name!}</p>
            {metadata.instructorRole && (
              <p className="text-xs text-muted-foreground">
                {metadata.instructorRole}
              </p>
            )}
          </div>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {duration && (
          <>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{duration}</span>
            </div>
            <Separator orientation="vertical" className="h-8" />
          </>
        )}

        <div className="text-sm text-muted-foreground">
          Last updated: {formatDate(lesson.updatedAt.toString())}
        </div>
      </div>
    </div>
  );
}
