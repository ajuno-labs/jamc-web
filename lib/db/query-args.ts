/**
 * Shared Prisma query arguments to avoid duplication across the codebase.
 * 
 * This file contains reusable select and include objects that can be used
 * in multiple places while maintaining type safety through Prisma's type system.
 */

import { Prisma } from '@prisma/client'

// ============================================================================
// COURSE QUERY ARGUMENTS
// ============================================================================

export const courseBasicSelectArgs = {
  id: true,
  authorId: true,
  title: true
} as const satisfies Prisma.CourseSelect

export const courseWithJoinCodeSelectArgs = {
  ...courseBasicSelectArgs,
  joinCode: true
} as const satisfies Prisma.CourseSelect

export const courseListSelectArgs = {
  slug: true,
  title: true
} as const satisfies Prisma.CourseSelect

// ============================================================================
// QUESTION QUERY ARGUMENTS
// ============================================================================

export const questionAuthorSelectArgs = {
  id: true,
  name: true
} as const satisfies Prisma.UserSelect

export const questionBasicIncludeArgs = {
  author: { select: questionAuthorSelectArgs },
  _count: { select: { answers: true } }
} as const satisfies Prisma.QuestionInclude

export const questionWithVotesIncludeArgs = {
  author: { select: questionAuthorSelectArgs },
  _count: { select: { answers: true } },
  votes: { select: { value: true } }
} as const satisfies Prisma.QuestionInclude

export const questionFullIncludeArgs = {
  author: { select: questionAuthorSelectArgs },
  _count: { select: { answers: true, votes: true } },
  votes: { select: { value: true } },
  tags: true,
  course: { select: courseBasicSelectArgs },
  lesson: { select: { id: true, title: true, slug: true } }
} as const satisfies Prisma.QuestionInclude

// ============================================================================
// USER QUERY ARGUMENTS
// ============================================================================

export const userBasicSelectArgs = {
  id: true,
  name: true,
  email: true,
  image: true
} as const satisfies Prisma.UserSelect

// ============================================================================
// TYPE HELPERS - Generate types from the query arguments
// ============================================================================

export type CourseBasic = Prisma.CourseGetPayload<{
  select: typeof courseBasicSelectArgs
}>

export type CourseWithJoinCode = Prisma.CourseGetPayload<{
  select: typeof courseWithJoinCodeSelectArgs
}>

export type CourseListItem = Prisma.CourseGetPayload<{
  select: typeof courseListSelectArgs
}>

export type QuestionWithAuthor = Prisma.QuestionGetPayload<{
  include: typeof questionBasicIncludeArgs
}>

export type QuestionWithVotes = Prisma.QuestionGetPayload<{
  include: typeof questionWithVotesIncludeArgs
}>

export type QuestionFull = Prisma.QuestionGetPayload<{
  include: typeof questionFullIncludeArgs
}>

export type UserBasic = Prisma.UserGetPayload<{
  select: typeof userBasicSelectArgs
}> 