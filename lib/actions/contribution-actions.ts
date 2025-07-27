"use server";

import { getCurrentUser } from "@/lib/auth/user";
import {
  getContributionHeatmap,
  getUserContributionStats,
  getUserStreak,
  getUserContributions,
} from "@/lib/services/contribution-service";

/**
 * Gets contribution heatmap data for the current user or specified user
 */
export async function getContributionHeatmapAction(userId?: string) {
  const user = await getCurrentUser();
  
  const targetUserId = userId || user.id;

  try {
    const heatmapData = await getContributionHeatmap(targetUserId);
    return { success: true, data: heatmapData };
  } catch (error) {
    console.error("Error fetching contribution heatmap:", error);
    return { success: false, error: "Failed to fetch contribution heatmap" };
  }
}

/**
 * Gets contribution stats for the current user or specified user
 */
export async function getContributionStatsAction(userId?: string) {
  const user = await getCurrentUser();
  
  // Use current user's ID if no userId specified
  const targetUserId = userId || user.id;

  try {
    const stats = await getUserContributionStats(targetUserId);
    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching contribution stats:", error);
    return { success: false, error: "Failed to fetch contribution stats" };
  }
}

/**
 * Gets user streak information
 */
export async function getUserStreakAction(userId?: string) {
  const user = await getCurrentUser();
  
  // Use current user's ID if no userId specified
  const targetUserId = userId || user.id;

  try {
    const streak = await getUserStreak(targetUserId);
    return { success: true, data: streak };
  } catch (error) {
    console.error("Error fetching user streak:", error);
    return { success: false, error: "Failed to fetch user streak" };
  }
}

/**
 * Gets contribution data for a date range
 */
export async function getContributionsAction(
  startDate: Date,
  endDate: Date,
  userId?: string
) {
  const user = await getCurrentUser();
  
  // Use current user's ID if no userId specified
  const targetUserId = userId || user.id;

  try {
    const contributions = await getUserContributions(
      targetUserId,
      startDate,
      endDate
    );
    return { success: true, data: contributions };
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return { success: false, error: "Failed to fetch contributions" };
  }
}
