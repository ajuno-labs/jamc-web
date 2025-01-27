import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test user if it doesn't exist
  const hashedPassword = await bcrypt.hash('password123', 10)
  await prisma.user.upsert({
    where: {
      email: 'test@example.com',
    },
    update: {
      password: hashedPassword
    },
    create: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      image: 'https://github.com/shadcn.png'
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
