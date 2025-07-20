"use server"

import { getEnhancedPrisma } from "@/lib/db/enhanced"
import { signUpSchema, type SignUpInput } from "@/lib/types/auth"
import { signIn } from "@/auth"
import { z } from "zod"
import { notifyWelcome } from "@/lib/services/notification-triggers"

export async function signUpUser(data: SignUpInput) {
  try {
    // Validate the input data
    const validatedData = signUpSchema.parse(data)
    
    const prisma = await getEnhancedPrisma()
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists"
      }
    }
    
    // Create the user - ZenStack will automatically hash the password
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password
      }
    })

    // 🔥 Send welcome notification
    try {
      await notifyWelcome(user.id)
    } catch (notificationError) {
      console.error("Failed to send welcome notification:", notificationError)
      // Don't fail the entire signup if notification fails
    }

    // Automatically sign in the user after successful signup
    try {
      await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      })
    } catch (signInError) {
      console.error("Error signing in after signup:", signInError)
      // Even if sign-in fails, the account was created successfully
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        message: "Account created successfully. Please sign in."
      }
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      autoSignedIn: true
    }
  } catch (error) {
    console.error("Error during signup:", error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid form data",
        fieldErrors: error.flatten().fieldErrors
      }
    }
    
    return {
      success: false,
      error: "An error occurred during signup. Please try again."
    }
  }
} 
