# Notification System Implementation Guide

## Overview

This document outlines how to implement the comprehensive notification system for your Q&A platform. The system includes:

- **In-app notifications** - Real-time notifications within the application
- **Email notifications** - Optional email delivery based on user preferences
- **Subscription system** - Users can follow questions, users, courses, and topics
- **Smart filtering** - Prevents spam and self-notifications
- **Customizable preferences** - Users control what notifications they receive

## Architecture

### Core Components

1. **Database Models** (`schema.zmodel`)
   - `Notification` - Stores individual notifications
   - `NotificationPreferences` - User's notification settings
   - `NotificationSubscription` - What users are following
   - `NotificationTemplate` - Message templates
   - `NotificationAnalytics` - Tracking and metrics

2. **Services** (`lib/services/`)
   - `notification-service.ts` - Core notification logic
   - `notification-triggers.ts` - Event-driven notification creation

3. **Types** (`lib/types/notification.ts`)
   - Complete TypeScript definitions for all notification-related data

## Implementation Steps

### Step 1: Database Migration

Run the migration to create the notification tables:

```bash
pnpm prisma db push
```

### Step 2: Integration with Existing Actions

Add notification triggers to your existing server actions. Here are examples:

#### Example 1: Answer Creation

Update `app/(protected)/questions/[id]/[slug]/_actions/question-actions.ts`:

```typescript
import { notifyNewAnswer, notifyNewCourseQuestion } from "@/lib/services/notification-triggers"

export async function addAnswer(questionId: string, content: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to answer")
  }

  const answer = await prisma.answer.create({
    data: {
      content,
      authorId: session.user.id,
      questionId,
    },
  })

  // 🔥 ADD THIS: Trigger notifications
  await notifyNewAnswer(answer.id, session.user.id)

  revalidatePath(`/question/${questionId}`)
  return answer
}
```

#### Example 2: Answer Acceptance

Update `app/(protected)/questions/[id]/[slug]/_actions/accept-answer-actions.ts`:

```typescript
import { notifyAnswerAccepted } from "@/lib/services/notification-triggers"

export async function acceptAnswerByUser(answerId: string) {
  // ... existing code ...

  const updatedAnswer = await db.answer.update({
    where: { id: answerId },
    data: {
      isAcceptedByUser: true,
      acceptedByUserAt: new Date(),
    }
  })

  // 🔥 ADD THIS: Trigger notification
  await notifyAnswerAccepted(answerId, user.id, false)

  revalidatePath(`/questions/${answer.question.id}/${answer.question.slug}`)
  return updatedAnswer
}
```

#### Example 3: Voting

Update `app/(protected)/questions/[id]/[slug]/_actions/question-actions.ts`:

```typescript
import { notifyVote } from "@/lib/services/notification-triggers"

export async function voteAnswer(answerId: string, value: 1 | -1) {
  // ... existing vote logic ...

  // 🔥 ADD THIS: Trigger notification (only for new votes)
  if (!existingVote) {
    await notifyVote('answer', answerId, value, session.user.id)
  }

  // ... rest of existing code ...
}
```

#### Example 4: Comments

Update comment creation actions:

```typescript
import { notifyComment } from "@/lib/services/notification-triggers"

export async function addComment(content: string, questionId?: string, answerId?: string) {
  // ... existing code ...

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: session.user.id,
      questionId,
      answerId
    }
  })

  // 🔥 ADD THIS: Trigger notification
  await notifyComment(comment.id, session.user.id, questionId, answerId)

  // ... rest of existing code ...
}
```

### Step 3: UI Components

#### Notification Bell Component

Create `components/notifications/NotificationBell.tsx`:

```tsx
"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getUnreadNotificationCount } from "@/lib/services/notification-service"

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadNotificationCount()
        setUnreadCount(count)
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
      }
    }

    fetchUnreadCount()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationList onNotificationRead={() => setUnreadCount(prev => Math.max(0, prev - 1))} />
      </PopoverContent>
    </Popover>
  )
}
```

#### Notification List Component

Create `components/notifications/NotificationList.tsx`:

```tsx
"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getUserNotifications, markNotificationsAsRead } from "@/lib/services/notification-service"

interface NotificationListProps {
  onNotificationRead?: () => void
}

export function NotificationList({ onNotificationRead }: NotificationListProps) {
  const [notifications, setNotifications] = useState<any[]>([])
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
            ? { ...notif, status: 'read', readAt: new Date() }
            : notif
        )
      )
      onNotificationRead?.()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  if (loading) {
    return <div className="p-4 text-center">Loading notifications...</div>
  }

  if (notifications.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
  }

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
      </div>
      <ScrollArea className="h-96">
        {notifications.map((notification, index) => (
          <div key={notification.id}>
            <div 
              className={`p-4 cursor-pointer hover:bg-muted/50 ${
                notification.status === 'UNREAD' ? 'bg-blue-50 dark:bg-blue-950/20' : ''
              }`}
              onClick={() => notification.status === 'UNREAD' && handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                {notification.actor && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={notification.actor.image} />
                    <AvatarFallback>
                      {notification.actor.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {notification.status === 'UNREAD' && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            </div>
            {index < notifications.length - 1 && <Separator />}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
```

### Step 4: Add to Header

Update your header component to include the notification bell:

```tsx
import { NotificationBell } from "@/components/notifications/NotificationBell"

export function Header() {
  return (
    <header className="...">
      {/* ... existing header content ... */}
      <div className="flex items-center space-x-4">
        <NotificationBell />
        {/* ... other header items ... */}
      </div>
    </header>
  )
}
```

### Step 5: Notification Preferences Page

Create `app/(protected)/settings/notifications/page.tsx`:

```tsx
import { getUserNotificationPreferences } from "@/lib/services/notification-service"
import { NotificationPreferencesForm } from "./_components/NotificationPreferencesForm"

export default async function NotificationSettingsPage() {
  const preferences = await getUserNotificationPreferences()
  
  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Notification Preferences</h1>
        <p className="text-muted-foreground">
          Choose how and when you want to be notified about activity on the platform.
        </p>
      </div>
      
      <NotificationPreferencesForm initialPreferences={preferences} />
    </div>
  )
}
```

## Testing the System

### 1. Manual Testing

1. Create a question as User A
2. Answer the question as User B
3. Check that User A receives a "NEW_ANSWER" notification
4. Accept the answer as User A
5. Check that User B receives an "ANSWER_ACCEPTED_USER" notification

### 2. Database Verification

```sql
-- Check notifications were created
SELECT * FROM "Notification" ORDER BY "createdAt" DESC LIMIT 10;

-- Check user preferences
SELECT * FROM "NotificationPreferences" WHERE "userId" = 'your-user-id';

-- Check subscriptions
SELECT * FROM "NotificationSubscription" WHERE "userId" = 'your-user-id';
```

## Future Enhancements

1. **Real-time notifications** using WebSockets or Server-Sent Events
2. **Email delivery** integration with SendGrid or AWS SES
3. **Push notifications** for mobile apps
4. **Advanced filtering** and smart bundling of similar notifications
5. **Analytics dashboard** for notification performance
6. **A/B testing** for notification templates

## Troubleshooting

### Common Issues

1. **Notifications not triggering**: Check that the trigger functions are called in your server actions
2. **Database errors**: Ensure you've run the migration with `pnpm prisma db push`
3. **Permission errors**: Verify the ZenStack access policies are correct
4. **Performance issues**: Consider implementing background job processing for large batches

### Debug Mode

Add this to your `.env.local` for detailed logging:

```env
DEBUG_NOTIFICATIONS=true
```

Then update the notification service to include debug logging:

```typescript
const DEBUG = process.env.DEBUG_NOTIFICATIONS === 'true'

export async function createNotification(request: NotificationCreateRequest) {
  if (DEBUG) {
    console.log('Creating notification:', request)
  }
  
  // ... rest of the function
}
```

## Conclusion

This notification system provides a solid foundation that can be extended based on your specific needs. Start with the basic Q&A notifications and gradually add more sophisticated features like email delivery, real-time updates, and advanced analytics.

The modular architecture makes it easy to add new notification types and customize the behavior for different user segments. 