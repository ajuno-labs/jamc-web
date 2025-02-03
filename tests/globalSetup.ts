import { FullConfig } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function globalSetup(config: FullConfig) {
  // Create test user if it doesn't exist
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: {
      email: 'test@example.com',
    },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  // Clean up
  await prisma.$disconnect();
}

export default globalSetup; 