import { Link } from "@/i18n/navigation"
import { MessageSquare, ThumbsUp, Tag, UserX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { QuestionType } from "@prisma/client"
import { MathContent } from '@/components/MathContent'
import { ClientDate } from "@/components/client-date"

interface QuestionCardProps {
  id: string
  slug: string
  title: string
  content: string | null
  type: QuestionType
  author: {
    name: string | null
    image: string | null
  }
  pseudonymousName?: {
    name: string
  } | null
  tags: Array<{ name: string }>
  answerCount: number
  voteCount: number
  createdAt: string
}

export function QuestionCard({
  id,
  slug,
  title,
  content,
  type,
  author,
  pseudonymousName,
  tags,
  answerCount,
  voteCount,
  createdAt,
}: QuestionCardProps) {
  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <Link 
          href={`/questions/${id}/${slug}`}
          className="text-xl font-semibold hover:text-primary"
        >
          {title}
        </Link>
        <Badge variant={
          type === QuestionType.OBJECTIVE ? "secondary" : 
          type === QuestionType.STRUCTURED ? "default" : 
          "outline"
        }>
          {type}
        </Badge>
      </div>
      {content && (
        <MathContent className="text-muted-foreground mb-4 line-clamp-2" content={content} />
      )}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {answerCount}
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            {voteCount}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag.name} 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Avatar className="h-6 w-6">
          {pseudonymousName ? (
            <AvatarFallback className="bg-muted">
              <UserX className="h-3 w-3" />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage src={author.image || undefined} />
              <AvatarFallback>{author.name?.[0]}</AvatarFallback>
            </>
          )}
        </Avatar>
        <span>{pseudonymousName ? pseudonymousName.name : author.name}</span>
        <span>•</span>
        <ClientDate date={createdAt} variant="short" />
      </div>
    </div>
  )
} 
