"use server"

import { getAuthUser } from "@/lib/auth/get-user"
import { notifyWelcome } from "@/lib/services/notification-triggers"
import { redirect } from "next/navigation"

export async function triggerWelcomeNotification() {
  const user = await getAuthUser()
  if (!user) {
    redirect("/signin")
  }

  try {
    await notifyWelcome(user.id)
    return { success: true }
  } catch (error) {
    console.error("Failed to send welcome notification:", error)
    return { success: false, error: "Failed to send welcome notification" }
  }
} 