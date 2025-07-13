"use server"

import { getAuthUser } from "@/lib/auth"
import { debugCreateTestNotification } from "@/lib/services/notification-service"
import { notifyWelcome, notifyNewAnswer } from "@/lib/services/notification-triggers"

export async function debugTestNotifications(
  type: 'welcome' | 'newAnswer' | 'test',
  userId: string,
  options?: { questionId?: string; answerId?: string }
) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    switch (type) {
      case 'welcome':
        await notifyWelcome(userId)
        return { success: true, message: "Welcome notification sent successfully" }
      
      case 'newAnswer':
        if (!options?.questionId || !options?.answerId) {
          return { success: false, error: "Question ID and Answer ID are required" }
        }
        await notifyNewAnswer(options.answerId, user.id)
        return { success: true, message: "New answer notification sent successfully" }
      
      case 'test':
        await debugCreateTestNotification(userId)
        return { success: true, message: "Test notification created successfully" }
      
      default:
        return { success: false, error: "Invalid notification type" }
    }
  } catch (error) {
    console.error("Debug notification error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }
  }
} 
