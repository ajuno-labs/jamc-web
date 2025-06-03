-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_ANSWER', 'ANSWER_ACCEPTED_USER', 'ANSWER_ACCEPTED_TEACHER', 'QUESTION_COMMENT', 'ANSWER_COMMENT', 'QUESTION_UPVOTE', 'QUESTION_DOWNVOTE', 'ANSWER_UPVOTE', 'ANSWER_DOWNVOTE', 'NEW_COURSE_QUESTION', 'NEW_LESSON', 'COURSE_UPDATE', 'FOLLOWED_USER_QUESTION', 'FOLLOWED_USER_ANSWER', 'FOLLOWED_QUESTION_ANSWER', 'FOLLOWED_TOPIC_QUESTION', 'STUDENT_AT_RISK', 'STUDENT_INACTIVE', 'DAILY_ACTIVITY_SUMMARY', 'WELCOME', 'REPUTATION_MILESTONE', 'WEEKLY_DIGEST', 'ACCOUNT_UPDATE');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'PUSH');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "channels" "NotificationChannel"[],
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "actorId" TEXT,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "newAnswer" "NotificationChannel"[] DEFAULT ARRAY['IN_APP', 'EMAIL']::"NotificationChannel"[],
    "answerAccepted" "NotificationChannel"[] DEFAULT ARRAY['IN_APP', 'EMAIL']::"NotificationChannel"[],
    "questionComment" "NotificationChannel"[] DEFAULT ARRAY['IN_APP', 'EMAIL']::"NotificationChannel"[],
    "answerComment" "NotificationChannel"[] DEFAULT ARRAY['IN_APP', 'EMAIL']::"NotificationChannel"[],
    "questionVote" "NotificationChannel"[] DEFAULT ARRAY['IN_APP']::"NotificationChannel"[],
    "answerVote" "NotificationChannel"[] DEFAULT ARRAY['IN_APP']::"NotificationChannel"[],
    "newCourseQuestion" "NotificationChannel"[] DEFAULT ARRAY['IN_APP', 'EMAIL']::"NotificationChannel"[],
    "newLesson" "NotificationChannel"[] DEFAULT ARRAY['IN_APP', 'EMAIL']::"NotificationChannel"[],
    "courseUpdate" "NotificationChannel"[] DEFAULT ARRAY['IN_APP', 'EMAIL']::"NotificationChannel"[],
    "followedUserActivity" "NotificationChannel"[] DEFAULT ARRAY['IN_APP']::"NotificationChannel"[],
    "followedQuestionActivity" "NotificationChannel"[] DEFAULT ARRAY['IN_APP']::"NotificationChannel"[],
    "studentEngagement" "NotificationChannel"[] DEFAULT ARRAY['IN_APP', 'EMAIL']::"NotificationChannel"[],
    "systemNotifications" "NotificationChannel"[] DEFAULT ARRAY['IN_APP', 'EMAIL']::"NotificationChannel"[],
    "emailDigestFrequency" TEXT NOT NULL DEFAULT 'WEEKLY',
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,
    "timezone" TEXT DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "channels" "NotificationChannel"[] DEFAULT ARRAY['IN_APP']::"NotificationChannel"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTemplate" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "titleTemplate" TEXT NOT NULL,
    "messageTemplate" TEXT NOT NULL,
    "defaultPriority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "defaultChannels" "NotificationChannel"[],
    "variables" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationBatch" (
    "id" TEXT NOT NULL,
    "batchData" JSONB NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "processingStartedAt" TIMESTAMP(3),
    "processingCompletedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationAnalytics" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "NotificationAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_status_idx" ON "Notification"("userId", "status");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_relatedEntityType_relatedEntityId_idx" ON "Notification"("relatedEntityType", "relatedEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreferences_userId_key" ON "NotificationPreferences"("userId");

-- CreateIndex
CREATE INDEX "NotificationSubscription_subscriptionType_entityId_idx" ON "NotificationSubscription"("subscriptionType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSubscription_userId_subscriptionType_entityId_key" ON "NotificationSubscription"("userId", "subscriptionType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTemplate_type_key" ON "NotificationTemplate"("type");

-- CreateIndex
CREATE INDEX "NotificationBatch_status_scheduledFor_idx" ON "NotificationBatch"("status", "scheduledFor");

-- CreateIndex
CREATE INDEX "NotificationAnalytics_notificationId_idx" ON "NotificationAnalytics"("notificationId");

-- CreateIndex
CREATE INDEX "NotificationAnalytics_userId_eventType_idx" ON "NotificationAnalytics"("userId", "eventType");

-- CreateIndex
CREATE INDEX "NotificationAnalytics_timestamp_idx" ON "NotificationAnalytics"("timestamp");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreferences" ADD CONSTRAINT "NotificationPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSubscription" ADD CONSTRAINT "NotificationSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAnalytics" ADD CONSTRAINT "NotificationAnalytics_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAnalytics" ADD CONSTRAINT "NotificationAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
