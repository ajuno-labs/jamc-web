"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { signInSchema } from "@/lib/types/auth";
import { z } from "zod";

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