export type NotificationType = 
  // Q&A Notifications
  | 'NEW_ANSWER'           // Someone answered your question
  | 'ANSWER_ACCEPTED_USER' // Your answer was accepted by question author
  | 'ANSWER_ACCEPTED_TEACHER' // Your answer was accepted by teacher
  | 'QUESTION_COMMENT'     // Comment on your question
  | 'ANSWER_COMMENT'       // Comment on your answer
  | 'QUESTION_UPVOTE'      // Upvote on your question
  | 'QUESTION_DOWNVOTE'    // Downvote on your question
  | 'ANSWER_UPVOTE'        // Upvote on your answer
  | 'ANSWER_DOWNVOTE'      // Downvote on your answer
  
  // Course/Lesson Notifications
  | 'NEW_COURSE_QUESTION'  // New question in your course (teacher)
  | 'NEW_LESSON'           // New lesson published
  | 'COURSE_UPDATE'        // Course content updated
  
  // Subscription Notifications
  | 'FOLLOWED_USER_QUESTION' // User you follow asked a question
  | 'FOLLOWED_USER_ANSWER'   // User you follow answered a question
  | 'FOLLOWED_QUESTION_ANSWER' // New answer to question you follow
  | 'FOLLOWED_TOPIC_QUESTION'  // New question in topic you follow
  
  // Engagement Notifications
  | 'STUDENT_AT_RISK'      // Student becoming at-risk
  | 'STUDENT_INACTIVE'     // Student becoming inactive
  | 'DAILY_ACTIVITY_SUMMARY' // Daily summary for teachers
  
  // System Notifications
  | 'WELCOME'              // Welcome message for new users
  | 'REPUTATION_MILESTONE' // Reached reputation milestone
  | 'WEEKLY_DIGEST'        // Weekly activity summary
  | 'ACCOUNT_UPDATE'       // Account-related updates

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED'

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'PUSH'

export interface NotificationMetadata {
  // Q&A related
  questionId?: string
  questionTitle?: string
  answerId?: string
  commentId?: string
  voteValue?: number
  
  // Course related
  courseId?: string
  courseTitle?: string
  lessonId?: string
  lessonTitle?: string
  
  // User related
  userId?: string
  userName?: string
  userImage?: string
  
  // Reputation related
  reputationChange?: number
  newReputationTotal?: number
  
  // Activity related
  activityCount?: number
  activityPeriod?: string
  
  // Custom metadata
  [key: string]: unknown
}

export interface BaseNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  status: NotificationStatus
  channels: NotificationChannel[]
  metadata: NotificationMetadata
  createdAt: Date
  readAt?: Date
  archivedAt?: Date
  
  // Relations
  userId: string
  actorId?: string // User who triggered the notification
  relatedEntityType?: string
  relatedEntityId?: string
}

export interface NotificationPreferences {
  id: string
  userId: string
  
  // Channel preferences for each notification type
  newAnswer: NotificationChannel[]
  answerAccepted: NotificationChannel[]
  questionComment: NotificationChannel[]
  answerComment: NotificationChannel[]
  questionVote: NotificationChannel[]
  answerVote: NotificationChannel[]
  newCourseQuestion: NotificationChannel[]
  newLesson: NotificationChannel[]
  courseUpdate: NotificationChannel[]
  followedUserActivity: NotificationChannel[]
  followedQuestionActivity: NotificationChannel[]
  studentEngagement: NotificationChannel[]
  systemNotifications: NotificationChannel[]
  
  // General preferences
  emailDigestFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'NEVER'
  quietHoursStart?: string // HH:mm format
  quietHoursEnd?: string   // HH:mm format
  timezone?: string
  
  createdAt: Date
  updatedAt: Date
}

export interface NotificationSubscription {
  id: string
  userId: string
  subscriptionType: 'USER' | 'QUESTION' | 'COURSE' | 'TAG' | 'LESSON'
  entityId: string
  channels: NotificationChannel[]
  createdAt: Date
}

// Template system for consistent notification messages
export interface NotificationTemplate {
  type: NotificationType
  titleTemplate: string
  messageTemplate: string
  defaultPriority: NotificationPriority
  defaultChannels: NotificationChannel[]
  variables: string[] // Variables that can be replaced in templates
}

// Batch processing for performance
export interface NotificationBatch {
  notifications: Omit<BaseNotification, 'id' | 'createdAt'>[]
  scheduledFor?: Date
  processingStartedAt?: Date
  processingCompletedAt?: Date
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  errorMessage?: string
}

// Analytics and tracking
export interface NotificationAnalytics {
  notificationId: string
  userId: string
  eventType: 'DELIVERED' | 'OPENED' | 'CLICKED' | 'DISMISSED'
  channel: NotificationChannel
  timestamp: Date
  metadata?: Record<string, unknown>
}

// Utility types for API responses
export interface NotificationListResponse {
  notifications: BaseNotification[]
  unreadCount: number
  totalCount: number
  hasMore: boolean
  nextCursor?: string
}

export interface NotificationMarkAsReadRequest {
  notificationIds: string[]
}

export interface NotificationCreateRequest {
  type: NotificationType
  userId: string
  actorId?: string
  metadata: NotificationMetadata
  customTitle?: string
  customMessage?: string
  priority?: NotificationPriority
  channels?: NotificationChannel[]
  scheduledFor?: Date
} 