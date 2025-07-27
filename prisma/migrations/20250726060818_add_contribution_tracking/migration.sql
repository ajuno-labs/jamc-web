/*
  Warnings:

  - You are about to drop the `Authenticator` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('FIRST_QUESTION', 'FIRST_ANSWER', 'FIRST_UPVOTE', 'STREAK_7_DAYS', 'STREAK_30_DAYS', 'STREAK_100_DAYS', 'POINTS_100', 'POINTS_1000', 'POINTS_10000', 'HELPFUL_ANSWERER', 'ACTIVE_LEARNER', 'COMMUNITY_BUILDER');

-- DropForeignKey
ALTER TABLE "Authenticator" DROP CONSTRAINT "Authenticator_userId_fkey";

-- DropTable
DROP TABLE "Authenticator";

-- CreateTable
CREATE TABLE "UserContribution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "questionsAsked" INTEGER NOT NULL DEFAULT 0,
    "answersProvided" INTEGER NOT NULL DEFAULT 0,
    "questionsUpvoted" INTEGER NOT NULL DEFAULT 0,
    "questionsDownvoted" INTEGER NOT NULL DEFAULT 0,
    "answersUpvoted" INTEGER NOT NULL DEFAULT 0,
    "answersDownvoted" INTEGER NOT NULL DEFAULT 0,
    "lessonsViewed" INTEGER NOT NULL DEFAULT 0,
    "commentsPosted" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStreak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" DATE,
    "totalContributionDays" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AchievementType" NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserContribution_userId_date_idx" ON "UserContribution"("userId", "date");

-- CreateIndex
CREATE INDEX "UserContribution_date_idx" ON "UserContribution"("date");

-- CreateIndex
CREATE UNIQUE INDEX "UserContribution_userId_date_key" ON "UserContribution"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UserStreak_userId_key" ON "UserStreak"("userId");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- CreateIndex
CREATE INDEX "UserAchievement_type_idx" ON "UserAchievement"("type");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_type_key" ON "UserAchievement"("userId", "type");

-- AddForeignKey
ALTER TABLE "UserContribution" ADD CONSTRAINT "UserContribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStreak" ADD CONSTRAINT "UserStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
