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

  // Create teacher users
  const teacherUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "teacher@example.com" },
      update: {
        name: "John Smith",
        roles: {
          connect: { id: teacherRole.id }
        }
      },
      create: {
        name: "John Smith",
        email: "teacher@example.com",
        password: await bcrypt.hash("password123", 10),
        roles: {
          connect: { id: teacherRole.id }
        }
      },
    }),
    prisma.user.upsert({
      where: { email: "sarah.math@example.com" },
      update: {
        name: "Sarah Johnson",
        roles: {
          connect: { id: teacherRole.id }
        }
      },
      create: {
        name: "Sarah Johnson",
        email: "sarah.math@example.com",
        password: await bcrypt.hash("password123", 10),
        roles: {
          connect: { id: teacherRole.id }
        }
      },
    }),
    prisma.user.upsert({
      where: { email: "david.stats@example.com" },
      update: {
        name: "David Chen",
        roles: {
          connect: { id: teacherRole.id }
        }
      },
      create: {
        name: "David Chen",
        email: "david.stats@example.com",
        password: await bcrypt.hash("password123", 10),
        roles: {
          connect: { id: teacherRole.id }
        }
      },
    }),
  ])

  // Create student users
  const studentUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "student@example.com" },
      update: {
        name: "Alice Brown",
        roles: {
          connect: { id: studentRole.id }
        }
      },
      create: {
        name: "Alice Brown",
        email: "student@example.com",
        password: await bcrypt.hash("password123", 10),
        roles: {
          connect: { id: studentRole.id }
        }
      },
    }),
    prisma.user.upsert({
      where: { email: "bob.student@example.com" },
      update: {
        name: "Bob Wilson",
        roles: {
          connect: { id: studentRole.id }
        }
      },
      create: {
        name: "Bob Wilson",
        email: "bob.student@example.com",
        password: await bcrypt.hash("password123", 10),
        roles: {
          connect: { id: studentRole.id }
        }
      },
    }),
    prisma.user.upsert({
      where: { email: "carol.student@example.com" },
      update: {
        name: "Carol Martinez",
        roles: {
          connect: { id: studentRole.id }
        }
      },
      create: {
        name: "Carol Martinez",
        email: "carol.student@example.com",
        password: await bcrypt.hash("password123", 10),
        roles: {
          connect: { id: studentRole.id }
        }
      },
    }),
    prisma.user.upsert({
      where: { email: "dave.student@example.com" },
      update: {
        name: "Dave Thompson",
        roles: {
          connect: { id: studentRole.id }
        }
      },
      create: {
        name: "Dave Thompson",
        email: "dave.student@example.com",
        password: await bcrypt.hash("password123", 10),
        roles: {
          connect: { id: studentRole.id }
        }
      },
    }),
  ])

  console.log('Users and roles seeded successfully')
  
  // Create default notification preferences for all users
  console.log('Creating default notification preferences...')
  const allUsers = [adminUser, ...teacherUsers, ...studentUsers]
  
  await Promise.all(allUsers.map(user => 
    prisma.notificationPreferences.upsert({
      where: { userId: user.id },
      update: {}, // Don't update existing preferences
      create: {
        userId: user.id,
        newAnswer: ['IN_APP', 'EMAIL'],
        answerAccepted: ['IN_APP', 'EMAIL'],
        questionComment: ['IN_APP', 'EMAIL'],
        answerComment: ['IN_APP', 'EMAIL'],
        questionVote: ['IN_APP'],
        answerVote: ['IN_APP'],
        newCourseQuestion: ['IN_APP', 'EMAIL'],
        newLesson: ['IN_APP', 'EMAIL'],
        courseUpdate: ['IN_APP', 'EMAIL'],
        followedUserActivity: ['IN_APP'],
        followedQuestionActivity: ['IN_APP'],
        studentEngagement: ['IN_APP', 'EMAIL'],
        systemNotifications: ['IN_APP', 'EMAIL'],
        emailDigestFrequency: 'WEEKLY',
        timezone: 'UTC'
      }
    })
  ))
  
  console.log('Notification preferences created successfully')
  
  return { 
    adminUser, 
    teacherUsers, 
    studentUsers,
    mainTeacher: teacherUsers[0],
    mainStudent: studentUsers[0]
  }
} 