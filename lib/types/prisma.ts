import { Prisma } from "@prisma/client"

// Type for user with roles and permissions
export type UserWithRoles = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        permissions: true
      }
    }
  }
}>

// Common user select object for consistent querying
export const userWithRolesInclude = {
  roles: {
    include: {
      permissions: true
    }
  }

} satisfies Prisma.UserInclude

// Type-safe function to check if user has a specific permission

export function hasPermission(user: UserWithRoles | null, permissionName: string): boolean {
  if (!user) return false
  return user.roles.some(role => 
    role.permissions.some(permission => permission.name === permissionName)
  )
} 