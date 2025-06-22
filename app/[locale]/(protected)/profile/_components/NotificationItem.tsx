import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, MessageSquare, ThumbsUp, Users, BookOpen, CheckCircle } from "lucide-react"

type NotificationWithActor = {
  id: string
  type: string
  title: string
  message: string
  status: 'UNREAD' | 'READ' | 'ARCHIVED'
  createdAt: Date
  actor?: {
    id: string
    name?: string | null
    image?: string | null
  } | null
}

interface NotificationItemProps {
  notification: NotificationWithActor
}

// Get icon for notification type
function getNotificationIcon(type: string) {
  switch (type) {
    case 'NEW_ANSWER':
    case 'ANSWER_COMMENT':
    case 'QUESTION_COMMENT':
      return <MessageSquare className="h-4 w-4" />
    case 'ANSWER_ACCEPTED_USER':
    case 'ANSWER_ACCEPTED_TEACHER':
      return <CheckCircle className="h-4 w-4" />
    case 'QUESTION_UPVOTE':
    case 'ANSWER_UPVOTE':
      return <ThumbsUp className="h-4 w-4" />
    case 'NEW_COURSE_QUESTION':
    case 'NEW_LESSON':
    case 'COURSE_UPDATE':
      return <BookOpen className="h-4 w-4" />
    case 'FOLLOWED_USER_QUESTION':
    case 'FOLLOWED_USER_ANSWER':
      return <Users className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg border ${
      notification.status === 'UNREAD' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : 'border-border'
    }`}>
      <div className="flex-shrink-0">
        {notification.actor ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={notification.actor.image || undefined} />
            <AvatarFallback>
              {notification.actor.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {getNotificationIcon(notification.type)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium leading-tight">
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1 leading-tight">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </p>
          </div>
          {notification.status === 'UNREAD' && (
            <Badge variant="secondary" className="ml-2 text-xs">
              New
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
} 