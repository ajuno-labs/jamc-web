"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export const signInWithGoogle = async () => {
  await signIn("google")
}

export const signInWithCredentials = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    
    if (result?.error) {
      return { error: "Invalid credentials" }
    }
    
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Authentication failed" }
    }
    return { error: "Something went wrong" }
  }
}
