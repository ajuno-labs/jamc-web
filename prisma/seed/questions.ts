import { prisma, slugify } from './utils'

export async function seedQuestions(
  studentId: string,
  calculus1Id: string,
  linearAlgebraId: string
) {
  console.log('Seeding questions...')
  
  const studentName = (await prisma.user.findUnique({
    where: { id: studentId },
    select: { name: true }
  }))?.name?.split(' ')[0].toLowerCase() || 'student'
  
  // Create a question for Calculus I
  await prisma.question.upsert({
    where: {
      slug: slugify(`${studentName}-help-with-limit-evaluation`)
    },
    update: {},
    create: {
      title: "Help with limit evaluation",
      content: "I'm having trouble evaluating this limit: \\[\\lim_{x \\to 0} \\frac{\\sin x}{x}\\]\nCan someone explain the steps?",
      type: "FORMAL",
      topic: "Limits",
      visibility: "PUBLIC",
      status: "OPEN",
      slug: slugify(`${studentName}-help-with-limit-evaluation`),
      authorId: studentId,
      courseId: calculus1Id
    }
  })

  // Create a question for Linear Algebra
  await prisma.question.upsert({
    where: {
      slug: slugify(`${studentName}-matrix-multiplication-order`)
    },
    update: {},
    create: {
      title: "Matrix multiplication order",
      content: "Why does the order matter in matrix multiplication? Why isn't AB = BA?",
      type: "FORMAL",
      topic: "Matrices",
      visibility: "PUBLIC",
      status: "OPEN",
      slug: slugify(`${studentName}-matrix-multiplication-order`),
      authorId: studentId,
      courseId: linearAlgebraId
    }
  })

  console.log('Questions seeded successfully')
} 