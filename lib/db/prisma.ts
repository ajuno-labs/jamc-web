import { PrismaClient } from "@prisma/client"

declare global {
  var cachedPrisma: PrismaClient
}

const prisma = 
  global.cachedPrisma || 
  new PrismaClient({
    log: ['query', 'error', 'warn', 'info'],
  })

if (process.env.NODE_ENV !== "production") {
  global.cachedPrisma = prisma
}

export { prisma } 