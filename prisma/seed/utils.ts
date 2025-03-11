import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Utility function for generating slugs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .trim()                   // Trim whitespace
} 