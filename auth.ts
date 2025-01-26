import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
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