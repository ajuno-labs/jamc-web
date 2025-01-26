import { z } from "zod"

export const signInSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .refine(email => email.endsWith("@jamc.edu.vn"), {
      message: "Must use your institutional email (@jamc.edu.vn)"
    }),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be less than 32 characters")
})

export type SignInInput = z.infer<typeof signInSchema> 