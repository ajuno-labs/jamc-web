import { prisma } from './utils'

export async function seedEnrollments(studentId: string, courses: { id: string }[]) {
  console.log('Seeding course enrollments...')
  
  // Create enrollments for the student in all courses
  const enrollments = await Promise.all(
    courses.map(course => 
      prisma.courseEnrollment.upsert({
        where: {
          userId_courseId: {
            userId: studentId,
            courseId: course.id
          }
        },
        update: {},
        create: {
          userId: studentId,
          courseId: course.id
        }
      })
    )
  )
  
  console.log(`Created ${enrollments.length} course enrollments`)
  
  return enrollments
} 