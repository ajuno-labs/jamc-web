import { prisma, slugify } from './utils'
import { QuestionType } from '@prisma/client'

export async function seedQuestions(
  studentId: string, 
  limitsModuleId: string, 
  matricesModuleId: string
) {
  console.log('Seeding questions...')
  
  // Create questions for the Limits module
  const limitQuestion = await prisma.question.create({
    data: {
      title: "Understanding the epsilon-delta definition of limits",
      content: "I'm struggling to understand the formal epsilon-delta definition of limits. Can someone explain it in simpler terms with an example?",
      authorId: studentId,
      moduleId: limitsModuleId,
      slug: slugify("Understanding the epsilon-delta definition of limits"),
      status: "OPEN",
      visibility: "PUBLIC",
      type: QuestionType.FORMAL
    }
  })
  
  // Create questions for the Matrices module
  const matrixQuestion = await prisma.question.create({
    data: {
      title: "Matrix multiplication order importance",
      content: "Why does the order of multiplication matter for matrices? I understand that A×B ≠ B×A in general, but I'm looking for an intuitive explanation of why this is the case.",
      authorId: studentId,
      moduleId: matricesModuleId,
      slug: slugify("Matrix multiplication order importance"),
      status: "OPEN",
      visibility: "PUBLIC",
      type: QuestionType.YOLO
    }
  })
  
  console.log('Questions seeded successfully')
  
  return { limitQuestion, matrixQuestion }
} 