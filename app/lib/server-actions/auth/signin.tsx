"use server"

import { signIn } from "@/auth"
import { SignInInput } from "../../validations/auth"
import { AuthError } from "next-auth"
import { ZodError } from "zod"

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" })
}

export const signInWithCredentials = async (data: SignInInput): Promise<{ error?: string; success?: boolean }> => {
  try {
    const result = await signIn("credentials", {
      ...data,
      redirect: false
    })

    if (!result?.ok) {
      return { error: "Invalid email or password" }
    }

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" }
    }
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: "An unexpected error occurred" }
  }
}