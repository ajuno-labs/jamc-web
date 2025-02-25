import { enhance } from "@zenstackhq/runtime"
import { auth } from "@/auth"
import { prisma } from "./prisma"
import { userWithRolesInclude } from "@/lib/types/prisma"

// Public enhanced client - for unrestricted read operations
// Uses a special context format to indicate explicitly this is for "everyone"
export function getPublicEnhancedPrisma() {
  // This is the key difference - use undefined for unauthenticated users
  // This tells ZenStack there is no authenticated user
  return enhance(prisma, { user: undefined }, { 
    logPrismaQuery: true // Keep logging for debugging
  })
}

// Enhanced client with user context - for operations that need access control
export async function getEnhancedPrisma() {
  const session = await auth()
  
  console.log('Session in getEnhancedPrisma:', {
    userEmail: session?.user?.email,
    userId: session?.user?.id
  })

  // No user in session - use non-authenticated context
  if (!session?.user?.email) {
    console.log('No authenticated user, using undefined user context')
    return enhance(prisma, { user: undefined }, { logPrismaQuery: true })
  }

  // Full user with roles and permissions
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    },
    include: userWithRolesInclude
  })
  
  if (!user) {
    console.log('User not found in database, using undefined user context')
    return enhance(prisma, { user: undefined }, { logPrismaQuery: true })
  }
  
  console.log('Enhanced with user context:', {
    id: user.id,
    email: user.email,
    roles: user.roles.map(r => ({
      name: r.name,
      permissions: r.permissions.map(p => p.name)
    }))
  })

  return enhance(prisma, { user }, { logPrismaQuery: true })
} 