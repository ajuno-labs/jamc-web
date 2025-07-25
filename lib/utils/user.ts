import { prisma } from "@/prisma"
import { calculateUserReputation } from "@/lib/utils/reputation"
import { notFound } from "next/navigation"

export interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: Date
  roles: Array<{
    id: number
    name: string
    permissions: Array<{
      id: number
      name: string
    }>
  }>
}

export interface UserStats {
  reputation: number
  questionCount: number
  answerCount: number
}

export interface UserWithStats extends UserData {
  stats: UserStats
}

/**
 * Get user data by ID with basic information
 */
export async function getUserById(userId: string): Promise<UserData> {
  if (!userId || typeof userId !== 'string') {
    notFound()
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      roles: {
        include: {
          permissions: true
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  return user
}

/**
 * Get user data by ID with statistics
 */
export async function getUserWithStats(userId: string): Promise<UserWithStats> {
  const user = await getUserById(userId)

  const [reputation, questionCount, answerCount] = await Promise.all([
    calculateUserReputation(userId),
    prisma.question.count({ where: { authorId: userId } }),
    prisma.answer.count({ where: { authorId: userId } })
  ])

  return {
    ...user,
    stats: {
      reputation,
      questionCount,
      answerCount
    }
  }
} 
