import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, ChevronRight } from "lucide-react"

type CourseVolumesProps = {
  volumes: {
    id: string
    title: string
    overview: string | null
    slug: string
    order: number
    chapters: {
      id: string
      title: string
      slug: string
      order: number
    }[]
  }[]
  courseId: string
  courseSlug: string
}

export default function CourseVolumes({ volumes, courseId, courseSlug }: CourseVolumesProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Course Structure</h2>
      
      <div className="space-y-6">
        {volumes.map((volume) => (
          <Card key={volume.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <Link 
                  href={`/courses/${courseId}/${courseSlug}/volumes/${volume.id}/${volume.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {volume.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {volume.overview && (
                <div className="mb-4">
                  <p className="text-muted-foreground">{volume.overview}</p>
                </div>
              )}
              
              {volume.chapters.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-sm font-medium mb-2">Chapters:</h3>
                  <ul className="space-y-2">
                    {volume.chapters.map((chapter) => (
                      <li key={chapter.id} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <Link 
                          href={`/courses/${courseId}/${courseSlug}/volumes/${volume.id}/${volume.slug}/chapters/${chapter.id}/${chapter.slug}`}
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {chapter.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 