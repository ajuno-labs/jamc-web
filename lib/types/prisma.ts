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

export type QuestionWithRelations = Prisma.QuestionGetPayload<{
  include: typeof questionWithRelationsInclude
}>

export function hasPermission(user: UserWithRoles | null, permissionName: string): boolean {
  if (!user) return false
  return user.roles.some(role => 
    role.permissions.some(permission => permission.name === permissionName)
  )
}

export function hasCompletedOnboarding(user: UserWithRoles | null): boolean {
  if (!user) return false
  return user.roles.length > 0
} 
