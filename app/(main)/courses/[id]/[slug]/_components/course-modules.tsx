import Link from "next/link"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { CourseModule } from "@/lib/types/course"

interface CourseModulesProps {
  modules: CourseModule[] | undefined
  courseId: string
  courseSlug: string
  isEnrolled: boolean
}

export default function CourseModules({ modules = [], courseId, courseSlug, isEnrolled }: CourseModulesProps) {
  if (!modules?.length) {
    return (
      <div className="text-muted-foreground text-center py-4">
        No modules available yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <Card key={module.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">
              {isEnrolled ? (
                <Link href={`/courses/${courseId}/${courseSlug}/modules/${module.id}`} className="hover:underline">
                  Module {index + 1}: {module.title}
                </Link>
              ) : (
                <>Module {index + 1}: {module.title}</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{module.content.substring(0, 150)}...</p>
            {!isEnrolled && index === 0 && (
              <p className="text-sm mt-2 italic">Enroll in this course to access all modules</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 