import { Prisma } from "@prisma/client"

export const userWithRolesInclude = {
  roles: {
    include: {
      permissions: true
    }
  }
} satisfies Prisma.UserInclude

export type UserWithRoles = Prisma.UserGetPayload<{
  include: typeof userWithRolesInclude
}>

export const questionWithRelationsInclude = {
  author: {
    select: {
      name: true,
      image: true
    }
  },
  tags: {
    select: {
      name: true
    }
  },
  attachments: {
    select: {
      url: true,
      type: true,
    }
  },
  _count: {
    select: {
      answers: true,
      votes: true
    }
  }
} satisfies Prisma.QuestionInclude

// Type for question with common relations
export type QuestionWithRelations = Prisma.QuestionGetPayload<{
  include: typeof questionWithRelationsInclude
}>

// Type-safe function to check if user has a specific permission
export function hasPermission(user: UserWithRoles | null, permissionName: string): boolean {
  if (!user) return false
  return user.roles.some(role => 
    role.permissions.some(permission => permission.name === permissionName)
  )
} 
