"use server";

import { getCurrentUser } from "@/lib/auth/user";
import { getEnhancedPrisma } from "@/lib/db/enhanced";

/**
 * Get student dashboard statistics
 */
export async function getStudentStats() {
  const user = await getCurrentUser();

  const db = await getEnhancedPrisma();

  const questionsAsked = await db.question.count({
    where: { authorId: user.id },
  });

  const answersReceived = await db.answer.count({
    where: { question: { authorId: user.id } },
  });

  const studyStreak = await calculateStudyStreak(user.id);

  const badges = 5;

  return {
    questionsAsked,
    answersReceived,
    badges,
    studyStreak,
  };
}

/**
 * Get enrolled courses with progress
 */
export async function getEnrolledCourses() {
  const user = await getCurrentUser();

  const db = await getEnhancedPrisma();

  const enrollments = await db.courseEnrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          lessons: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  // Calculate progress for each course
  const coursesWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const totalLessons = enrollment.course.lessons.length;
      const viewedLessons = await db.lessonView.count({
        where: {
          userId: user.id,
          lessonId: { in: enrollment.course.lessons.map((l) => l.id) },
        },
      });

      const progress = totalLessons > 0 ? Math.round((viewedLessons / totalLessons) * 100) : 0;

      return {
        id: enrollment.course.id,
        name: enrollment.course.title,
        progress,
        color: getCourseColor(enrollment.course.id), // Generate consistent color based on course ID
      };
    })
  );

  return coursesWithProgress;
}

/**
 * Get recent questions by the user
 */
export async function getRecentQuestions(limit = 5) {
  const user = await getCurrentUser();

  const db = await getEnhancedPrisma();

  const questions = await db.question.findMany({
    where: { authorId: user.id },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      answers: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return questions.map((question) => ({
    id: question.id,
    question: question.title,
    status: question.status === "SOLVED" ? ("Answered" as const) : ("Unanswered" as const),
    timestamp: formatTimeAgo(question.createdAt),
    answers: question.answers.length,
  }));
}

/**
 * Get recent notifications for the user
 */
export async function getRecentNotifications(limit = 5) {
  const user = await getCurrentUser();

  const db = await getEnhancedPrisma();

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return notifications.map((notification) => ({
    type: mapNotificationType(notification.type),
    message: notification.message,
    time: formatTimeAgo(notification.createdAt),
  }));
}

/**
 * Get suggested topics/questions for the user
 */
export async function getSuggestions(limit = 3) {
  const user = await getCurrentUser();

  const db = await getEnhancedPrisma();

  const recentQuestions = await db.question.findMany({
    where: { authorId: user.id },
    select: { tags: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const userTags = new Set<string>();
  recentQuestions.forEach((q) => {
    q.tags.forEach((tag) => userTags.add(tag.name));
  });

  const suggestions = await db.question.findMany({
    where: {
      tags: { some: { name: { in: Array.from(userTags) } } },
      authorId: { not: user.id },
    },
    select: { title: true },
    orderBy: { viewCount: "desc" },
    take: limit,
  });

  return suggestions.map((s) => s.title);
}

/**
 * Get upcoming deadlines (placeholder - would need to be implemented based on course structure)
 */
export async function getUpcomingDeadlines() {
  // This is a placeholder implementation
  // In a real application, this would fetch from a deadlines/assignments table
  // For now, return empty array
  return [];
}

async function calculateStudyStreak(userId: string): Promise<number> {
  const db = await getEnhancedPrisma();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activities = await db.activityLog.findMany({
    where: {
      userId,
      createdAt: { gte: thirtyDaysAgo },
      type: { in: ["VIEW_LESSON", "ASK_QUESTION", "ANSWER_QUESTION"] },
    },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);

    const hasActivity = activities.some((activity) => {
      const activityDate = new Date(activity.createdAt);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === checkDate.getTime();
    });

    if (hasActivity) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function getCourseColor(courseId: string): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-yellow-500",
  ];

  const index =
    courseId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hour${
      Math.floor(diffInSeconds / 3600) > 1 ? "s" : ""
    } ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} day${
      Math.floor(diffInSeconds / 86400) > 1 ? "s" : ""
    } ago`;

  return `${Math.floor(diffInSeconds / 2592000)} month${
    Math.floor(diffInSeconds / 2592000) > 1 ? "s" : ""
  } ago`;
}

function mapNotificationType(type: string): "answer" | "deadline" | "badge" {
  switch (type) {
    case "NEW_ANSWER":
    case "ANSWER_ACCEPTED_USER":
    case "ANSWER_ACCEPTED_TEACHER":
      return "answer";
    case "NEW_LESSON":
    case "COURSE_UPDATE":
      return "deadline";
    case "REPUTATION_MILESTONE":
    case "WELCOME":
      return "badge";
    default:
      return "answer";
  }
}
