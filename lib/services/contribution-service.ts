"use server";

import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { ActivityType } from "@prisma/client";

const ACTIVITY_POINTS = {
  ASK_QUESTION: 2,
  ANSWER_QUESTION: 5,
  UPVOTE_QUESTION: 1,
  DOWNVOTE_QUESTION: -1,
  UPVOTE_ANSWER: 1,
  DOWNVOTE_ANSWER: -1,
  VIEW_LESSON: 1,
  UNVIEW_LESSON: -1,
  // Additional activities for comments (we'll track these separately)
  POST_COMMENT: 1,
} as const;

export interface ContributionData {
  questionsAsked: number;
  answersProvided: number;
  questionsUpvoted: number;
  questionsDownvoted: number;
  answersUpvoted: number;
  answersDownvoted: number;
  lessonsViewed: number;
  commentsPosted: number;
  totalPoints: number;
}

/**
 * Updates daily contribution data for a user
 */
export async function updateUserContribution(
  userId: string,
  activityType: ActivityType,
  date: Date = new Date()
): Promise<void> {
  // Normalize date to start of day
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  // Determine which field to increment
  const updates: Partial<ContributionData> = {};
  let pointsToAdd = 0;

  switch (activityType) {
    case "ASK_QUESTION":
      updates.questionsAsked = 1;
      pointsToAdd = ACTIVITY_POINTS.ASK_QUESTION;
      break;
    case "ANSWER_QUESTION":
      updates.answersProvided = 1;
      pointsToAdd = ACTIVITY_POINTS.ANSWER_QUESTION;
      break;
    case "UPVOTE_QUESTION":
      updates.questionsUpvoted = 1;
      pointsToAdd = ACTIVITY_POINTS.UPVOTE_QUESTION;
      break;
    case "DOWNVOTE_QUESTION":
      updates.questionsDownvoted = 1;
      pointsToAdd = ACTIVITY_POINTS.DOWNVOTE_QUESTION;
      break;
    case "UPVOTE_ANSWER":
      updates.answersUpvoted = 1;
      pointsToAdd = ACTIVITY_POINTS.UPVOTE_ANSWER;
      break;
    case "DOWNVOTE_ANSWER":
      updates.answersDownvoted = 1;
      pointsToAdd = ACTIVITY_POINTS.DOWNVOTE_ANSWER;
      break;
    case "VIEW_LESSON":
      updates.lessonsViewed = 1;
      pointsToAdd = ACTIVITY_POINTS.VIEW_LESSON;
      break;
    case "UNVIEW_LESSON":
      updates.lessonsViewed = -1;
      pointsToAdd = ACTIVITY_POINTS.UNVIEW_LESSON;
      break;
  }

  if (Object.keys(updates).length === 0) {
    return; // No contribution tracking for this activity type
  }

  // Use upsert to either create new or update existing contribution record
  const db = await getEnhancedPrisma();
  await db.userContribution.upsert({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
    create: {
      userId,
      date: normalizedDate,
      ...updates,
      totalPoints: pointsToAdd,
    },
    update: {
      ...Object.fromEntries(
        Object.entries(updates).map(([key, value]) => [
          key,
          {
            increment: value,
          },
        ])
      ),
      totalPoints: {
        increment: pointsToAdd,
      },
    },
  });

  // Update user streak information
  await updateUserStreak(userId, normalizedDate);
}

/**
 * Updates user streak information
 */
async function updateUserStreak(userId: string, date: Date): Promise<void> {
  const db = await getEnhancedPrisma();
  const streak = await db.userStreak.findUnique({
    where: { userId },
  });

  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);

  if (!streak) {
    // First contribution ever
    await db.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: date,
        totalContributionDays: 1,
        totalPoints: 0, // Will be calculated separately
      },
    });
    return;
  }

  const lastActiveDate = streak.lastActiveDate;
  let newCurrentStreak = 1;

  if (lastActiveDate) {
    const daysDiff = Math.floor(
      (date.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      // Same day, no streak change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      newCurrentStreak = streak.currentStreak + 1;
    } else {
      // Broken streak, reset to 1
      newCurrentStreak = 1;
    }
  }

  await db.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(streak.longestStreak, newCurrentStreak),
      lastActiveDate: date,
      totalContributionDays: {
        increment: 1,
      },
    },
  });
}

/**
 * Gets user contribution data for a date range
 */
export async function getUserContributions(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<ContributionData[]> {
  const db = await getEnhancedPrisma();
  const contributions = await db.userContribution.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return contributions.map((c) => ({
    questionsAsked: c.questionsAsked,
    answersProvided: c.answersProvided,
    questionsUpvoted: c.questionsUpvoted,
    questionsDownvoted: c.questionsDownvoted,
    answersUpvoted: c.answersUpvoted,
    answersDownvoted: c.answersDownvoted,
    lessonsViewed: c.lessonsViewed,
    commentsPosted: c.commentsPosted,
    totalPoints: c.totalPoints,
  }));
}

/**
 * Gets contribution heatmap data for the past year
 */
export async function getContributionHeatmap(userId: string): Promise<
  Array<{
    date: string;
    count: number;
    level: number; // 0-4 for heatmap intensity
  }>
> {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const db = await getEnhancedPrisma();
  const contributions = await db.userContribution.findMany({
    where: {
      userId,
      date: {
        gte: oneYearAgo,
      },
    },
    select: {
      date: true,
      totalPoints: true,
    },
  });

  // Convert to heatmap format
  const heatmapData = contributions.map((c) => {
    // Calculate intensity level (0-4) based on points
    let level = 0;
    if (c.totalPoints > 0) level = 1;
    if (c.totalPoints > 5) level = 2;
    if (c.totalPoints > 10) level = 3;
    if (c.totalPoints > 20) level = 4;

    return {
      date: c.date.toISOString().split("T")[0],
      count: c.totalPoints,
      level,
    };
  });

  return heatmapData;
}

/**
 * Gets user streak information
 */
export async function getUserStreak(userId: string) {
  const db = await getEnhancedPrisma();
  return await db.userStreak.findUnique({
    where: { userId },
  });
}

/**
 * Gets user contribution stats
 */
export async function getUserContributionStats(userId: string) {
  const db = await getEnhancedPrisma();
  const streak = await getUserStreak(userId);
  const contributions = await db.userContribution.findMany({
    where: { userId },
    select: {
      totalPoints: true,
      questionsAsked: true,
      answersProvided: true,
      lessonsViewed: true,
    },
  });

  const totalStats = contributions.reduce(
    (acc, c) => {
      acc.totalPoints += c.totalPoints;
      acc.totalQuestions += c.questionsAsked;
      acc.totalAnswers += c.answersProvided;
      acc.totalLessonsViewed += c.lessonsViewed;
      return acc;
    },
    {
      totalPoints: 0,
      totalQuestions: 0,
      totalAnswers: 0,
      totalLessonsViewed: 0,
    }
  );

  return {
    ...totalStats,
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
    totalContributionDays: streak?.totalContributionDays ?? 0,
  };
}

/**
 * Tracks comment contributions (since comments aren't in ActivityType enum)
 */
export async function trackCommentContribution(userId: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const db = await getEnhancedPrisma();
  await db.userContribution.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    create: {
      userId,
      date: today,
      commentsPosted: 1,
      totalPoints: ACTIVITY_POINTS.POST_COMMENT,
    },
    update: {
      commentsPosted: {
        increment: 1,
      },
      totalPoints: {
        increment: ACTIVITY_POINTS.POST_COMMENT,
      },
    },
  });

  await updateUserStreak(userId, today);
}
