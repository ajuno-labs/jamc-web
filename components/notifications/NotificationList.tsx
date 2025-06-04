"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getUserNotifications, markNotificationsAsRead } from "@/lib/services/notification-service"
import { Bell, MessageSquare, ThumbsUp, Users, BookOpen, CheckCircle } from "lucide-react"

interface NotificationListProps {
  onNotificationRead?: () => void
}

// Use a more flexible type to match what the API actually returns
type NotificationWithActor = Awaited<ReturnType<typeof getUserNotifications>>['notifications'][0]

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

export function NotificationList({ onNotificationRead }: NotificationListProps) {
  const [notifications, setNotifications] = useState<NotificationWithActor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await getUserNotifications(undefined, { limit: 20 })
        setNotifications(result.notifications)
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationsAsRead([notificationId])
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: 'READ' as const, readAt: new Date() }
            : notif
        )
      )
      onNotificationRead?.()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter(n => n.status === 'UNREAD')
      .map(n => n.id)
      
    if (unreadIds.length === 0) return

    try {
      await markNotificationsAsRead(unreadIds)
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          status: 'READ' as const, 
          readAt: new Date() 
        }))
      )
      // Call the callback for each notification marked as read
      unreadIds.forEach(() => onNotificationRead?.())
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  if (loading) {
    return <div className="p-4 text-center">Loading notifications...</div>
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No notifications yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          You&apos;ll see notifications here when there&apos;s activity on your questions and answers.
        </p>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="h-96">
        {notifications.map((notification, index) => (
          <div key={notification.id}>
            <div 
              className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                notification.status === 'UNREAD' ? 'bg-blue-50 dark:bg-blue-950/20' : ''
              }`}
              onClick={() => notification.status === 'UNREAD' && handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
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
                  <p className="text-sm font-medium leading-tight">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-tight">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                    {notification.status === 'UNREAD' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {index < notifications.length - 1 && <Separator />}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
} 