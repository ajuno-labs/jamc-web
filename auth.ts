import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import { signInSchema } from "@/app/lib/validations/auth"
import { ZodError } from "zod"
import bcrypt from "bcryptjs"

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
          
          if (!user?.password) {
            throw new Error("Please sign in with OAuth provider")
          }

          const isValidPassword = await bcrypt.compare(password, user.password)
          
          if (!user || !isValidPassword) {
            throw new Error("Invalid email or password")
          }

          return user
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error(error.errors[0].message)
          }
          throw error
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
  pages: {
    signIn: "/signin"
  }
})