import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/user-avatar"
import { enrollInCourse } from "../_actions/course-actions"

interface CourseHeaderProps {
  title: string
  description: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  tags: {
    id: string
    name: string
  }[]
  isEnrolled: boolean
  courseId: string
  userId: string | undefined
}

export function CourseHeader({
  title,
  description,
  author,
  tags,
  isEnrolled,
  courseId,
  userId,
}: CourseHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={author.name || "Unknown"}
              image={author.image}
              className="h-10 w-10"
            />
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>
                By {author.name || "Unknown"}
              </CardDescription>
            </div>
          </div>
          {userId && !isEnrolled && (
            <form action={enrollInCourse}>
              <input type="hidden" name="courseId" value={courseId} />
              <Button type="submit">Enroll Now</Button>
            </form>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 