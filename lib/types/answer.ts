import { Prisma } from "@prisma/client"

// Answer with all relations for the question page
export const answerWithRelationsInclude = {
  author: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  votes: {
    select: {
      id: true,
      value: true,
      userId: true,
    }
  },
  comments: {
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        }
      },
      votes: {
        select: {
          id: true,
          value: true,
          userId: true,
        }
      }
    },
    orderBy: {
      createdAt: 'asc' as const
    }
  },
  question: {
    select: {
      id: true,
      authorId: true,
      courseId: true,
      course: {
        select: {
          authorId: true,
        }
      }
    }
  }
} satisfies Prisma.AnswerInclude

export type AnswerWithRelations = Prisma.AnswerGetPayload<{
  include: typeof answerWithRelationsInclude
}>

// Extended answer type with computed fields for the UI
export type AnswerWithAcceptance = Omit<AnswerWithRelations, 'author' | 'comments'> & {
  isAcceptedByUser: boolean
  isAcceptedByTeacher: boolean
  acceptedByUserAt?: Date | null
  acceptedByTeacherId?: string | null
  questionOwnerId: string
  courseTeacherId?: string
  isLinkedToCourse: boolean
  author: {
    id: string
    name: string | null
    image: string | null
    reputation?: number
  }
  comments: Array<{
    id: string
    content: string
    createdAt: Date
    author: {
      id: string
      name: string | null
      image: string | null
      reputation?: number
    }
    votes: Array<{
      id: string
      value: number
      userId: string
    }>
  }>
} 