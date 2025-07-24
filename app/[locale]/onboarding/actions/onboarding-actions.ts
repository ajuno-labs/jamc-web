"use server";

import { userWithRolesInclude } from "@/lib/types/prisma";
import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { getCurrentUser } from "@/lib/auth/user";
import { getDatabaseRole, Role } from "@/lib/types/roles";


export async function handleRoleSelect(role: Role) {
  return await assignUserRole(role);
}

export async function assignUserRole(role: Role) {
  const user = await getCurrentUser(userWithRolesInclude);
  console.log("user", user);
  const enhancedPrisma = await getEnhancedPrisma(user);
  const roleRecord = await getDatabaseRole(role);

  if (!roleRecord) {
    return {
      success: false,
      error: "Role not found",
    };
  }

  await enhancedPrisma.user.update({
    where: { id: user.id },
    data: {
      roles: {
        connect: { id: roleRecord.id },
      },
    },
  });

  try {
    await enhancedPrisma.notificationPreferences.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
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
  } catch (preferencesError) {
    console.warn("Failed to create notification preferences (non-critical):", preferencesError);
  }

  return {
    success: true,
    role: role,
  };
}

export async function joinCourseWithCode(joinCode: string) {
  const user = await getCurrentUser(userWithRolesInclude);
  const enhancedPrisma = await getEnhancedPrisma();

  const course = await enhancedPrisma.course.findUnique({
    where: { joinCode: joinCode.toUpperCase() },
    select: { id: true, slug: true, title: true },
  });

  if (!course) {
    return {
      success: false,
      error: "Invalid course code. Please check the code and try again.",
    };
  }

  const existingEnrollment = await enhancedPrisma.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (existingEnrollment) {
    return {
      success: false,
      error: "You are already enrolled in this course",
    };
  }

  await enhancedPrisma.courseEnrollment.create({
    data: {
      userId: user.id,
      courseId: course.id,
    },
  });

  return {
    success: true,
    courseSlug: course.slug,
    courseTitle: course.title,
  };
}

