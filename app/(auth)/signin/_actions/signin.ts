"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { object, string, z } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};

export const signInWithCredentials = async (data: SignInInput) => {
  try {
    await signIn("credentials", data, { redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw error;
  }
};
