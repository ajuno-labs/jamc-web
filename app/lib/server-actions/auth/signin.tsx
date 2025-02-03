"use server"

import { signIn } from "@/auth"
import { SignInInput } from "../../validations/auth"
import { AuthError } from "next-auth"

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" })
}

export const signInWithCredentials = async (data: SignInInput) => {
  try {
   await signIn("credentials", data, { redirectTo: "/" })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" }
    }
    throw error
  }
}