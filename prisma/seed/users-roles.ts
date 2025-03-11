import bcrypt from 'bcryptjs'
import { prisma } from './utils'
import { PermissionType } from '@prisma/client'

export async function seedUsersAndRoles() {
  console.log('Seeding users and roles...')
  
  // Create permissions
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { id: 1 },
      update: { name: PermissionType.READ },
      create: { id: 1, name: PermissionType.READ },
    }),
    prisma.permission.upsert({
      where: { id: 2 },
      update: { name: PermissionType.CREATE },
      create: { id: 2, name: PermissionType.CREATE },
    }),
    prisma.permission.upsert({
      where: { id: 3 },
      update: { name: PermissionType.UPDATE },
      create: { id: 3, name: PermissionType.UPDATE },
    }),
    prisma.permission.upsert({
      where: { id: 4 },
      update: { name: PermissionType.DELETE },
      create: { id: 4, name: PermissionType.DELETE },
    }),
    prisma.permission.upsert({
      where: { id: 5 },
      update: { name: PermissionType.MANAGE },
      create: { id: 5, name: PermissionType.MANAGE },
    }),
  ])

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { id: 1 },
    update: {
      name: "ADMIN",
      permissions: {
        connect: permissions.map(p => ({ id: p.id }))
      }
    },
    create: {
      id: 1,
      name: "ADMIN",
      permissions: {
        connect: permissions.map(p => ({ id: p.id }))
      }
    },
  })

  const teacherRole = await prisma.role.upsert({
    where: { id: 2 },
    update: {
      name: "TEACHER",
      permissions: {
        connect: [
          { id: permissions[0].id }, // READ
          { id: permissions[1].id }, // CREATE
          { id: permissions[2].id }, // UPDATE
        ]
      }
    },
    create: {
      id: 2,
      name: "TEACHER",
      permissions: {
        connect: [
          { id: permissions[0].id }, // READ
          { id: permissions[1].id }, // CREATE
          { id: permissions[2].id }, // UPDATE
        ]
      }
    },
  })

  const studentRole = await prisma.role.upsert({
    where: { id: 3 },
    update: {
      name: "STUDENT",
      permissions: {
        connect: [
          { id: permissions[0].id }, // READ
        ]
      }
    },
    create: {
      id: 3,
      name: "STUDENT",
      permissions: {
        connect: [
          { id: permissions[0].id }, // READ
        ]
      }
    },
  })

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      name: "Admin User",
      roles: {
        connect: { id: adminRole.id }
      }
    },
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: await bcrypt.hash("password123", 10),
      roles: {
        connect: { id: adminRole.id }
      }
    },
  })

  // Create teacher user
  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {
      name: "Teacher User",
      roles: {
        connect: { id: teacherRole.id }
      }
    },
    create: {
      name: "Teacher User",
      email: "teacher@example.com",
      password: await bcrypt.hash("password123", 10),
      roles: {
        connect: { id: teacherRole.id }
      }
    },
  })

  // Create student user
  const studentUser = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {
      name: "Student User",
      roles: {
        connect: { id: studentRole.id }
      }
    },
    create: {
      name: "Student User",
      email: "student@example.com",
      password: await bcrypt.hash("password123", 10),
      roles: {
        connect: { id: studentRole.id }
      }
    },
  })

  console.log('Users and roles seeded successfully')
  
  return { adminUser, teacherUser, studentUser }
} 