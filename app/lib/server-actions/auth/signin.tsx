"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { signInSchema } from "@/app/lib/validations/auth"
import { ZodError } from "zod"

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" })
}

export const signInWithCredentials = async (email: string, password: string) => {
  try {
    // Validate input first
    await signInSchema.parseAsync({ email, password })

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    
    if (result?.error) {
      return { error: result.error }
    }
    
    if (result?.ok) {
      return { success: true }
    }

    return { error: "Authentication failed" }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message }
    }
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" }
    }
    return { error: "An unexpected error occurred" }
  }
}
