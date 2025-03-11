import { prisma } from './seed/utils'
import { seedUsersAndRoles } from './seed/users-roles'
import { seedCourses } from './seed/courses'
import { seedModules } from './seed/modules'
import { seedCourseStructure } from './seed/course-structure'
import { seedQuestions } from './seed/questions'

async function main() {
  try {
    // Seed users and roles
    const { teacherUser, studentUser } = await seedUsersAndRoles()
    
    // Seed courses
    const { calculus1, linearAlgebra, statistics, discreteMath } = await seedCourses(teacherUser.id)
    
    // Seed modules (legacy structure)
    const { limitsModule, matricesModule } = await seedModules(
      calculus1.id, 
      linearAlgebra.id, 
      statistics.id, 
      discreteMath.id
    )
    
    // Seed new course structure
    await seedCourseStructure(calculus1.id)
    
    // Seed questions
    await seedQuestions(studentUser.id, limitsModule.id, matricesModule.id)
    
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
