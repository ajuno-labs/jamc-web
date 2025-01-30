import { PrismaClient } from "@prisma/client"
import { enhance } from "@zenstackhq/runtime"
import { auth } from "./auth" // Import auth from your Auth.js config

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Create base Prisma client
const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Create an async function to get enhanced client with auth context
export async function getEnhancedPrisma() {
  // Get current session from Auth.js
  const session = await auth()

  let user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? ""
    }
  })
  
  // Enhance Prisma client with user context for ZenStack
  return enhance(prisma, {
    user: user ?? undefined
  })
}

// Export base client for Auth.js adapter
export { prisma }