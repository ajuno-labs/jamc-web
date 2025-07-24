"use server";

import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { getCurrentUser } from "@/lib/auth/user";
import type {
  NotificationType,
  NotificationCreateRequest,
  NotificationMetadata,
  NotificationChannel,
} from "@/lib/types/notification";
import { Prisma } from "@prisma/client";

const NOTIFICATION_TEMPLATES: Record<
  NotificationType,
  {
    title: string;
    message: string;
    defaultChannels: NotificationChannel[];
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  }
> = {
  NEW_ANSWER: {
    title: "New answer to your question",
    message: "{{userName}} answered your question '{{questionTitle}}'",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "HIGH",
  },
  ANSWER_ACCEPTED_USER: {
    title: "Your answer was accepted!",
    message: "{{userName}} accepted your answer to '{{questionTitle}}'",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "HIGH",
  },
  ANSWER_ACCEPTED_TEACHER: {
    title: "Teacher accepted your answer!",
    message: "{{userName}} (teacher) accepted your answer to '{{questionTitle}}'",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "HIGH",
  },
  QUESTION_COMMENT: {
    title: "New comment on your question",
    message: "{{userName}} commented on your question '{{questionTitle}}'",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
  },
  ANSWER_COMMENT: {
    title: "New comment on your answer",
    message: "{{userName}} commented on your answer to '{{questionTitle}}'",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
  },
  QUESTION_UPVOTE: {
    title: "Your question was upvoted",
    message: "Someone upvoted your question '{{questionTitle}}'",
    defaultChannels: ["IN_APP"],
    priority: "LOW",
  },
  QUESTION_DOWNVOTE: {
    title: "Your question was downvoted",
    message: "Someone downvoted your question '{{questionTitle}}'",
    defaultChannels: ["IN_APP"],
    priority: "LOW",
  },
  ANSWER_UPVOTE: {
    title: "Your answer was upvoted",
    message: "Someone upvoted your answer to '{{questionTitle}}'",
    defaultChannels: ["IN_APP"],
    priority: "LOW",
  },
  ANSWER_DOWNVOTE: {
    title: "Your answer was downvoted",
    message: "Someone downvoted your answer to '{{questionTitle}}'",
    defaultChannels: ["IN_APP"],
    priority: "LOW",
  },
  NEW_COURSE_QUESTION: {
    title: "New question in your course",
    message: "{{userName}} asked a question in {{courseTitle}}",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
  },
  NEW_LESSON: {
    title: "New lesson published",
    message: "New lesson '{{lessonTitle}}' is now available in {{courseTitle}}",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
  },
  COURSE_UPDATE: {
    title: "Course updated",
    message: "{{courseTitle}} has been updated",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
  },
  FOLLOWED_USER_QUESTION: {
    title: "{{userName}} asked a question",
    message: "{{userName}} asked '{{questionTitle}}'",
    defaultChannels: ["IN_APP"],
    priority: "MEDIUM",
  },
  FOLLOWED_USER_ANSWER: {
    title: "{{userName}} answered a question",
    message: "{{userName}} answered '{{questionTitle}}'",
    defaultChannels: ["IN_APP"],
    priority: "MEDIUM",
  },
  FOLLOWED_QUESTION_ANSWER: {
    title: "New answer to followed question",
    message: "{{userName}} answered '{{questionTitle}}' which you're following",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
  },
  FOLLOWED_TOPIC_QUESTION: {
    title: "New question in followed topic",
    message: "{{userName}} asked a question about a topic you follow",
    defaultChannels: ["IN_APP"],
    priority: "MEDIUM",
  },
  STUDENT_AT_RISK: {
    title: "Student needs attention",
    message: "{{userName}} hasn't been active in {{courseTitle}} for over a week",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "HIGH",
  },
  STUDENT_INACTIVE: {
    title: "Inactive student",
    message: "{{userName}} hasn't been active in {{courseTitle}} for over two weeks",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "HIGH",
  },
  DAILY_ACTIVITY_SUMMARY: {
    title: "Daily activity summary",
    message: "Your course {{courseTitle}} had {{activityCount}} activities today",
    defaultChannels: ["EMAIL"],
    priority: "MEDIUM",
  },
  WELCOME: {
    title: "Welcome to our platform!",
    message: "Welcome {{userName}}! Get started by exploring courses and asking questions.",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
  },
  REPUTATION_MILESTONE: {
    title: "Reputation milestone reached!",
    message: "Congratulations! You've reached {{newReputationTotal}} reputation points.",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
  },
  WEEKLY_DIGEST: {
    title: "Your weekly activity digest",
    message: "Here's what happened this week in your courses and questions.",
    defaultChannels: ["EMAIL"],
    priority: "LOW",
  },
  ACCOUNT_UPDATE: {
    title: "Account updated",
    message: "Your account settings have been updated successfully.",
    defaultChannels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
  },
};

function replaceTemplateVariables(template: string, metadata: NotificationMetadata): string {
  let result = template;
  const variables = template.match(/\{\{(\w+)\}\}/g) || [];
  for (const variable of variables) {
    const key = variable.replace(/[{}]/g, "");
    const value = metadata[key] || "";
    result = result.replace(variable, String(value));
  }
  return result;
}

export async function createDefaultNotificationPreferences(userId: string) {
  const db = await getEnhancedPrisma();
  return await db.notificationPreferences.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      newAnswer: ["IN_APP", "EMAIL"],
      answerAccepted: ["IN_APP", "EMAIL"],
      questionComment: ["IN_APP", "EMAIL"],
      answerComment: ["IN_APP", "EMAIL"],
      questionVote: ["IN_APP"],
      answerVote: ["IN_APP"],
      newCourseQuestion: ["IN_APP", "EMAIL"],
      newLesson: ["IN_APP", "EMAIL"],
      courseUpdate: ["IN_APP", "EMAIL"],
      followedUserActivity: ["IN_APP"],
      followedQuestionActivity: ["IN_APP"],
      studentEngagement: ["IN_APP", "EMAIL"],
      systemNotifications: ["IN_APP", "EMAIL"],
      emailDigestFrequency: "WEEKLY",
      timezone: "UTC",
    },
  });
}

async function getUserNotificationPreferences(userId: string) {
  const publicDb = await getEnhancedPrisma();
  const preferences = await publicDb.notificationPreferences.findUnique({
    where: { userId },
  });
  if (!preferences) {
    return {
      id: `default-${userId}`,
      userId,
      newAnswer: ["IN_APP", "EMAIL"],
      answerAccepted: ["IN_APP", "EMAIL"],
      questionComment: ["IN_APP", "EMAIL"],
      answerComment: ["IN_APP", "EMAIL"],
      questionVote: ["IN_APP"],
      answerVote: ["IN_APP"],
      newCourseQuestion: ["IN_APP", "EMAIL"],
      newLesson: ["IN_APP", "EMAIL"],
      courseUpdate: ["IN_APP", "EMAIL"],
      followedUserActivity: ["IN_APP"],
      followedQuestionActivity: ["IN_APP"],
      studentEngagement: ["IN_APP", "EMAIL"],
      systemNotifications: ["IN_APP", "EMAIL"],
      emailDigestFrequency: "WEEKLY",
      quietHoursStart: null,
      quietHoursEnd: null,
      timezone: "UTC",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { id: userId },
    } as const;
  }
  return preferences;
}

type UserPreferences = NonNullable<Awaited<ReturnType<typeof getUserNotificationPreferences>>>;

function getEffectiveChannels(
  type: NotificationType,
  preferences: UserPreferences,
  defaultChannels: NotificationChannel[]
): NotificationChannel[] {
  const preferenceMap: Record<string, keyof UserPreferences> = {
    NEW_ANSWER: "newAnswer",
    ANSWER_ACCEPTED_USER: "answerAccepted",
    ANSWER_ACCEPTED_TEACHER: "answerAccepted",
    QUESTION_COMMENT: "questionComment",
    ANSWER_COMMENT: "answerComment",
    QUESTION_UPVOTE: "questionVote",
    QUESTION_DOWNVOTE: "questionVote",
    ANSWER_UPVOTE: "answerVote",
    ANSWER_DOWNVOTE: "answerVote",
    NEW_COURSE_QUESTION: "newCourseQuestion",
    NEW_LESSON: "newLesson",
    COURSE_UPDATE: "courseUpdate",
    FOLLOWED_USER_QUESTION: "followedUserActivity",
    FOLLOWED_USER_ANSWER: "followedUserActivity",
    FOLLOWED_QUESTION_ANSWER: "followedQuestionActivity",
    FOLLOWED_TOPIC_QUESTION: "followedQuestionActivity",
    STUDENT_AT_RISK: "studentEngagement",
    STUDENT_INACTIVE: "studentEngagement",
    DAILY_ACTIVITY_SUMMARY: "studentEngagement",
    WELCOME: "systemNotifications",
    REPUTATION_MILESTONE: "systemNotifications",
    WEEKLY_DIGEST: "systemNotifications",
    ACCOUNT_UPDATE: "systemNotifications",
  };
  const preferenceKey = preferenceMap[type];
  if (preferenceKey && preferences[preferenceKey]) {
    return preferences[preferenceKey] as NotificationChannel[];
  }
  return defaultChannels;
}

export async function createNotification(request: NotificationCreateRequest): Promise<string> {
  const db = await getEnhancedPrisma();
  const template = NOTIFICATION_TEMPLATES[request.type];
  if (!template) {
    throw new Error(`No template found for notification type: ${request.type}`);
  }
  const preferences = await getUserNotificationPreferences(request.userId);
  const effectiveChannels =
    request.channels || getEffectiveChannels(request.type, preferences, template.defaultChannels);
  const title = request.customTitle || replaceTemplateVariables(template.title, request.metadata);
  const message =
    request.customMessage || replaceTemplateVariables(template.message, request.metadata);
  const notification = await db.notification.create({
    data: {
      type: request.type,
      title,
      message,
      priority: request.priority || template.priority,
      channels: effectiveChannels,
      metadata: request.metadata as Prisma.InputJsonValue,
      userId: request.userId,
      actorId: request.actorId,
      relatedEntityType: request.metadata.questionId
        ? "Question"
        : request.metadata.answerId
        ? "Answer"
        : request.metadata.courseId
        ? "Course"
        : request.metadata.lessonId
        ? "Lesson"
        : undefined,
      relatedEntityId:
        request.metadata.questionId ||
        request.metadata.answerId ||
        request.metadata.courseId ||
        request.metadata.lessonId ||
        undefined,
    },
  });
  return notification.id;
}

export async function createNotifications(
  requests: NotificationCreateRequest[]
): Promise<string[]> {
  const notificationIds: string[] = [];
  for (const request of requests) {
    try {
      const id = await createNotification(request);
      notificationIds.push(id);
    } catch (error) {
      console.error(`Failed to create notification for user ${request.userId}:`, error);
    }
  }
  return notificationIds;
}

export async function getUserNotifications(
  userId?: string,
  options: {
    status?: "UNREAD" | "READ" | "ARCHIVED";
    limit?: number;
    cursor?: string;
  } = {}
) {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (!user?.id) {
    throw new Error("Authentication required");
  }
  const db = await getEnhancedPrisma();
  const { status, limit = 20, cursor } = options;
  const where: Prisma.NotificationWhereInput = {
    userId: user.id,
    ...(status && { status }),
  };
  const notifications = await db.notification.findMany({
    where,
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });
  const hasMore = notifications.length > limit;
  if (hasMore) {
    notifications.pop();
  }
  const unreadCount = await db.notification.count({
    where: {
      userId: user.id,
      status: "UNREAD",
    },
  });
  return {
    notifications,
    unreadCount,
    totalCount: notifications.length,
    hasMore,
    nextCursor: hasMore ? notifications[notifications.length - 1]?.id : undefined,
  };
}

export async function markNotificationsAsRead(notificationIds: string[]): Promise<number> {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("Authentication required");
  }
  const db = await getEnhancedPrisma();
  const result = await db.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId: user.id,
      status: "UNREAD",
    },
    data: {
      status: "READ",
      readAt: new Date(),
    },
  });
  return result.count;
}

export async function archiveNotifications(notificationIds: string[]): Promise<number> {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("Authentication required");
  }
  const db = await getEnhancedPrisma();
  const result = await db.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId: user.id,
    },
    data: {
      status: "ARCHIVED",
      archivedAt: new Date(),
    },
  });
  return result.count;
}

export async function getUnreadNotificationCount(userId?: string): Promise<number> {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (!user?.id) {
    return 0;
  }
  const db = await getEnhancedPrisma();
  return await db.notification.count({
    where: {
      userId: user.id,
      status: "UNREAD",
    },
  });
}

export async function debugCreateTestNotification(userId: string) {
  const db = await getEnhancedPrisma();
  try {
    const notification = await db.notification.create({
      data: {
        type: "WELCOME",
        title: "Test Notification",
        message: "This is a test notification to verify the system is working",
        priority: "MEDIUM",
        channels: ["IN_APP"],
        metadata: { test: true },
        userId: userId,
      },
    });
    console.log("Test notification created:", notification.id);
    return notification;
  } catch (error) {
    console.error("Failed to create test notification:", error);
    throw error;
  }
}
