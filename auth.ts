import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import { signInSchema } from "@/app/lib/validations/auth"
import { ZodError } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null
          
          const { email, password } = await signInSchema.parseAsync(credentials)
          
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user) {
            throw new Error("Invalid credentials")
          }

          // In a real app, you would hash the password and compare hashes
          // This is just for demo purposes
          if (password !== "demo123") {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
          }
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error(error.errors[0].message)
          }
          if (error instanceof Error) {
            throw error
          }
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string
      return session
    },
  },
})