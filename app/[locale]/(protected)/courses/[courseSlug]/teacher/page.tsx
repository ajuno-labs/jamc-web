import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { DashboardPage } from "./_components/DashboardPage";
import { randomBytes } from "crypto";
import { getCourseStudentActivity } from "./_actions/student-activity-actions";
import {
  getWeeklyActivityData,
  getModuleCompletionData,
  getEnrollmentTrendData,
} from "./_actions/dashboard-data-actions";
import {
  courseWithJoinCodeSelectArgs,
  courseListSelectArgs,
  questionWithVotesIncludeArgs,
  type QuestionWithVotes,
} from "@/lib/db/query-args";

interface TeacherDashboardPageProps {
  params: Promise<{ courseSlug: string }>;
}

export default async function TeacherDashboardPage({ params }: TeacherDashboardPageProps) {
  const { courseSlug } = await params;

  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });
  if (!user) {
    notFound();
  }

  const db = await getEnhancedPrisma();

  let course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: courseWithJoinCodeSelectArgs,
  });
  if (!course || course.authorId !== user.id) {
    notFound();
  }

  if (!course!.joinCode) {
    const code = randomBytes(4).toString("hex").toUpperCase();
    await db.course.update({
      where: { id: course!.id },
      data: { joinCode: code },
    });
    course = { ...course, joinCode: code };
  }

  const activitySummary = await getCourseStudentActivity(courseSlug);

  const courses = await db.course.findMany({
    where: { authorId: user.id },
    select: courseListSelectArgs,
  });

  const rawQuestions = await db.question.findMany({
    where: { courseId: course.id },
    include: questionWithVotesIncludeArgs,
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const openQuestionsCount = await db.question.count({
    where: { courseId: course.id },
  });

  const unansweredCount = await db.question.count({
    where: { courseId: course.id, answers: { none: {} } },
  });

  const questions: (Omit<QuestionWithVotes, 'createdAt'> & { createdAt: string })[] = rawQuestions.map((q: QuestionWithVotes) => ({
    ...q,
    createdAt: q.createdAt.toISOString(),
  }));

  const [weeklyActivityData, moduleCompletionData, enrollmentTrendData] = await Promise.all([
    getWeeklyActivityData(courseSlug),
    getModuleCompletionData(courseSlug),
    getEnrollmentTrendData(courseSlug),
  ]);

  return (
    <DashboardPage
      questions={questions}
      courses={courses}
      currentCourseSlug={courseSlug}
      joinCode={course!.joinCode}
      activitySummary={activitySummary}
      weeklyActivityData={weeklyActivityData}
      moduleCompletionData={moduleCompletionData}
      enrollmentTrendData={enrollmentTrendData}
      openQuestionsCount={openQuestionsCount}
      unansweredCount={unansweredCount}
    />
  );
}
