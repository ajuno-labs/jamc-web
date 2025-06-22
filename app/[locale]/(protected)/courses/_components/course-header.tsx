import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "./user-avatar"
import { enrollInCourse } from "../_actions/course-actions"

interface CourseHeaderProps {
  courseId: string
  title: string
  description: string
  author: {
    id: string
    name: string
    image: string | null
  }
  tags: {
    id: string
    name: string
  }[]
  userId?: string | null
  isEnrolled?: boolean
}

export function CourseHeader({
  courseId,
  title,
  description,
  author,
  tags,
  userId,
  isEnrolled,
}: CourseHeaderProps) {
  const handleEnroll = async (formData: FormData) => {
    await enrollInCourse(formData)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <UserAvatar name={author.name} image={author.image} />
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>by {author.name}</CardDescription>
            </div>
          </div>
          {userId && !isEnrolled && (
            <form action={handleEnroll}>
              <input type="hidden" name="courseId" value={courseId} />
              <Button type="submit">Enroll Now</Button>
            </form>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 