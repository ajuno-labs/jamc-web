"use server"

import { prisma } from "@/lib/db/prisma"
import { auth } from "@/auth"
import { z } from "zod"
import { revalidatePath } from "next/cache"

// Validation schema for profile update
const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional().nullable(),
  email: z.string().email({ message: "Please enter a valid email" }),
  image: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
})

export type ProfileUpdateData = z.infer<typeof profileSchema>

export async function updateUserProfile(data: ProfileUpdateData) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }
    
    // Validate form data
    const validatedData = profileSchema.parse(data)
    
    // Check for email uniqueness if email is being changed
    if (validatedData.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })
      
      if (existingUser) {
        return { success: false, error: "Email already in use" }
      }
    }
    
    // Update the user profile
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        image: validatedData.image
      }
    })
    
    // Revalidate the profile page to show updated data
    revalidatePath("/profile")
    revalidatePath("/profile/edit")
    
    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Validation failed", 
        fieldErrors: error.flatten().fieldErrors 
      }
    }
    
    return { success: false, error: "Failed to update profile" }
  }
} 