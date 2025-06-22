import { Link } from "@/i18n/navigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Folder, FileText } from "lucide-react";

export interface CourseContentProps {
  courseSlug: string;
  modules: {
    id: string;
    title: string;
    slug: string;
    order: number;
    chapters: {
      id: string;
      title: string;
      slug: string;
      order: number;
      lessons: {
        id: string;
        title: string;
        slug: string;
        order: number;
      }[];
    }[];
  }[];
}

export function CourseContent({ courseSlug, modules }: CourseContentProps) {
  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Course Syllabus</CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6 pb-6">
        {modules.length > 0 ? (
          <Accordion type="multiple" defaultValue={modules.map((mod) => mod.slug)} className="w-full space-y-2">
            {modules.map((mod) => (
              <AccordionItem
                key={mod.id}
                value={mod.slug}
                className="border border-border bg-card rounded-lg shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="py-3 px-4 text-left font-semibold flex items-center gap-2">
                  <Folder className="h-4 w-4 text-primary/70" />
                  {mod.title}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-3 px-6 bg-background">
                  {mod.chapters.map((chap) => (
                    <div key={chap.id} className="mb-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary/70" />
                        {chap.title}
                      </h3>
                      <div className="space-y-1 pl-4">
                        {chap.lessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={`/courses/${courseSlug}/lessons/${lesson.id}/${lesson.slug}`}
                            className="flex items-center gap-2 py-1 hover:text-primary"
                          >
                            <BookOpen className="h-4 w-4 text-primary/70" />
                            <span className="text-sm truncate">{lesson.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            The structure for this course has not been defined yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
