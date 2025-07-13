"use server"

import { getAuthUser } from "@/lib/auth"
import { notifyWelcome } from "@/lib/services/notification-triggers"
import { redirect } from "@/i18n/navigation"

export async function triggerWelcomeNotification() {
  const user = await getAuthUser()
  if (!user) {
    return redirect("/signin")
  }

  try {
    await notifyWelcome(user.id)
    return { success: true }
  } catch (error) {
    console.error("Failed to send welcome notification:", error)
    return { success: false, error: "Failed to send welcome notification" }
  }
} 
