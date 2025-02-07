import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'


const prisma = new PrismaClient()

async function main() {
  // Create permissions
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { id: 1 },
      update: { name: "READ" },
      create: { id: 1, name: "READ" },
    }),
    prisma.permission.upsert({
      where: { id: 2 },
      update: { name: "CREATE" },
      create: { id: 2, name: "CREATE" },
    }),
    prisma.permission.upsert({
      where: { id: 3 },
      update: { name: "UPDATE" },
      create: { id: 3, name: "UPDATE" },
    }),
    prisma.permission.upsert({
      where: { id: 4 },
      update: { name: "DELETE" },
      create: { id: 4, name: "DELETE" },
    }),
    prisma.permission.upsert({
      where: { id: 5 },
      update: { name: "MANAGE" },
      create: { id: 5, name: "MANAGE" },
    }),
  ])

  // Create roles
  const studentRole = await prisma.role.upsert({
    where: { id: 1 },
    update: {
      name: "STUDENT",
      permissions: {
        connect: [
          { id: permissions[0].id }, // READ
          { id: permissions[1].id }, // CREATE
        ],
      },
    },
    create: {
      id: 1,
      name: "STUDENT",
      permissions: {
        connect: [
          { id: permissions[0].id }, // READ
          { id: permissions[1].id }, // CREATE
        ],
      },
    },
  })

  const teacherRole = await prisma.role.upsert({
    where: { id: 2 },
    update: {
      name: "TEACHER",
      permissions: {
        connect: permissions.map(p => ({ id: p.id })), // All permissions
      },
    },
    create: {
      id: 2,
      name: "TEACHER",
      permissions: {
        connect: permissions.map(p => ({ id: p.id })), // All permissions
      },
    },
  })

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {
      password: hashedPassword,
      roles: {
        connect: { id: teacherRole.id },
      },
    },
    create: {
      email: 'teacher@example.com',
      name: 'Dr. Smith',
      password: hashedPassword,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
      roles: {
        connect: { id: teacherRole.id },
      },
    },
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {
      password: hashedPassword,
      roles: {
        connect: { id: studentRole.id },
      },
    },
    create: {
      email: 'student@example.com',
      name: 'John Doe',
      password: hashedPassword,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      roles: {
        connect: { id: studentRole.id },
      },
    },
  })

  // Create questions
  const question1 = await prisma.question.create({
    data: {
      title: "Understanding the Pythagorean Theorem",
      content: "Can someone explain how the Pythagorean theorem relates to real-world applications? I understand the basic formula a² + b² = c², but I'm struggling to see its practical uses.",
      type: "FORMAL",
      visibility: "PUBLIC",
      topic: "Mathematics",
      authorId: student.id,
      tags: {
        create: [
          { name: "mathematics", description: "Questions about math concepts" },
          { name: "geometry", description: "Topics related to shapes and spaces" },
        ],
      },
    },
  })

  // Question 2
  await prisma.question.create({
    data: {
      title: "Quick question about derivatives",
      content: "What's the easiest way to remember the power rule for derivatives? I keep mixing it up!",
      type: "YOLO",
      visibility: "PUBLIC",
      authorId: student.id,
      tags: {
        connect: [{ name: "mathematics" }],
        create: [{ name: "calculus", description: "Questions about calculus" }],
      },
    },
  })

  // Create answers
  await prisma.answer.create({
    data: {
      content: "The Pythagorean theorem is incredibly practical! Here are some real-world applications:\n\n1. Architecture: Calculating diagonal distances and ensuring right angles in construction\n2. Navigation: Used in GPS systems to calculate distances\n3. Engineering: Determining forces in structural analysis\n4. Computer Graphics: Calculating distances between points in 2D/3D space",
      authorId: teacher.id,
      questionId: question1.id,
      isAccepted: true,
    },
  })

  await prisma.answer.create({
    data: {
      content: "I use it all the time in my engineering work! For example, when designing support structures, we need to calculate the length of diagonal braces, and the Pythagorean theorem is perfect for this.",
      authorId: student.id,
      questionId: question1.id,
      isAccepted: false,
    },
  })

  // Create some votes
  await prisma.questionVote.create({
    data: {
      questionId: question1.id,
      userId: teacher.id,
      value: 1,
    },
  })

  await prisma.questionVote.create({
    data: {
      questionId: question1.id,
      userId: student.id,
      value: 1,
    },
  })

  console.log('Seed data created successfully!')
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
