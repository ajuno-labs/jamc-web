"use server";

import { getCurrentUser } from "@/lib/auth/user";
import { notifyWelcome } from "@/lib/services/notification-triggers";

export async function triggerWelcomeNotification() {
  const user = await getCurrentUser();
  await notifyWelcome(user.id);
  return { success: true };
}
