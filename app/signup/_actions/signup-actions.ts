"use server"

import { getPublicEnhancedPrisma } from "@/lib/db/enhanced"
import { signUpSchema, type SignUpInput } from "@/lib/types/auth"
import bcrypt from "bcryptjs"
import { z } from "zod"

export async function signUpUser(data: SignUpInput) {
  try {
    // Validate the input data
    const validatedData = signUpSchema.parse(data)
    
    const prisma = getPublicEnhancedPrisma()
    
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
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword
      }
    })
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
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