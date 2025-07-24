"use server";

import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { userWithRolesInclude } from "@/lib/types/prisma";
import { questionWithRelationsInclude } from "@/lib/types/prisma";
import { calculateUserReputationWithBreakdown } from "@/lib/utils/reputation";
import type { ProfileData, ProfileQuestion } from "@/lib/types/profile";

/**
 * Get current user's profile data
 */
export async function getUserProfile(): Promise<ProfileData | null> {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    include: userWithRolesInclude,
  });

  if (!user) {
    return null;
  }

  // Get user's questions
  const questions = await prisma.question.findMany({
    where: {
      authorId: user.id,
    },
    include: questionWithRelationsInclude,
    orderBy: {
      createdAt: "desc",
    },
    take: 5, // Limit to most recent 5 questions
  });

  // Get user's answers
  const answers = await prisma.answer.findMany({
    where: {
      authorId: user.id,
    },
    include: {
      question: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5, // Limit to most recent 5 answers
  });

  // Count total questions and answers
  const [totalQuestions, totalAnswers] = await Promise.all([
    prisma.question.count({
      where: { authorId: user.id },
    }),
    prisma.answer.count({
      where: { authorId: user.id },
    }),
  ]);

  // Calculate detailed reputation breakdown
  const reputationData = await calculateUserReputationWithBreakdown(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      roles: user.roles.map((role) => ({
        name: role.name,
        permissions: role.permissions.map((p) => p.name),
      })),
    },
    questions: questions.map((q) => ({
      id: q.id,
      slug: q.slug,
      title: q.title,
      type: q.type,
      createdAt: q.createdAt.toISOString(),
      answerCount: q._count.answers,
      voteCount: q._count.votes,
    })),
    answers: answers.map((a) => ({
      id: a.id,
      content: a.content.substring(0, 100) + (a.content.length > 100 ? "..." : ""),
      questionId: a.questionId,
      questionTitle: a.question.title,
      questionSlug: a.question.slug,
      createdAt: a.createdAt.toISOString(),
      isAccepted: a.isAcceptedByUser || a.isAcceptedByTeacher,
    })),
    stats: {
      totalQuestions,
      totalAnswers,
      reputation: reputationData.total,
      reputationBreakdown: reputationData.breakdown,
    },
  };
}

/**
 * Update user role from student to teacher or vice versa
 */
export async function updateUserRole(newRole: "teacher" | "student") {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    include: userWithRolesInclude,
  });

  if (!user) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  // Map role to database role names
  const roleName = newRole === "teacher" ? "TEACHER" : "STUDENT";

  // Find the role in the database
  const roleRecord = await prisma.role.findFirst({
    where: { name: roleName },
  });

  if (!roleRecord) {
    return {
      success: false,
      error: "Role not found",
    };
  }

  // Update user role (disconnect all existing roles and connect the new one)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      roles: {
        set: [], // Disconnect all existing roles
        connect: { id: roleRecord.id }, // Connect new role
      },
    },
  });

  return {
    success: true,
    role: roleName,
  };
}

/**
 * Get all user's questions with pagination
 */
export async function getAllUserQuestions(page = 1, limit = 10) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    include: userWithRolesInclude,
  });

  if (!user) {
    return null;
  }

  const skip = (page - 1) * limit;

  const [questions, totalCount] = await Promise.all([
    prisma.question.findMany({
      where: {
        authorId: user.id,
      },
      include: {
        ...questionWithRelationsInclude,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.question.count({
      where: { authorId: user.id },
    }),
  ]);

  return {
    questions: questions.map((q) => ({
      id: q.id,
      slug: q.slug,
      title: q.title,
      type: q.type,
      createdAt: q.createdAt.toISOString(),
      answerCount: q._count.answers,
      voteCount: q._count.votes,
      status: q.status,
      course: q.course
        ? {
          id: q.course.id,
          title: q.course.title,
          slug: q.course.slug,
        }
        : null,
      lesson: q.lesson
        ? {
          id: q.lesson.id,
          title: q.lesson.title,
          slug: q.lesson.slug,
        }
        : null,
    })) as ProfileQuestion[],
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1,
    },
  };
}
