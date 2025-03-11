import { prisma, slugify } from './utils'

export async function seedCourses(teacherId: string) {
  console.log('Seeding courses...')
  
  // Create tags
  const mathTag = await prisma.tag.upsert({
    where: { name: "Mathematics" },
    update: {},
    create: {
      name: "Mathematics",
      description: "Topics related to mathematics"
    },
  })

  const calculusTag = await prisma.tag.upsert({
    where: { name: "Calculus" },
    update: {},
    create: {
      name: "Calculus",
      description: "Topics related to calculus"
    },
  })

  const algebraTag = await prisma.tag.upsert({
    where: { name: "Linear Algebra" },
    update: {},
    create: {
      name: "Linear Algebra",
      description: "Topics related to linear algebra"
    },
  })

  const statsTag = await prisma.tag.upsert({
    where: { name: "Statistics" },
    update: {},
    create: {
      name: "Statistics",
      description: "Topics related to statistics and probability"
    },
  })

  const discreteTag = await prisma.tag.upsert({
    where: { name: "Discrete Mathematics" },
    update: {},
    create: {
      name: "Discrete Mathematics",
      description: "Topics related to discrete mathematics"
    },
  })

  // Create courses
  const calculus1 = await prisma.course.upsert({
    where: { slug: "calculus-i" },
    update: {
      tags: {
        connect: [
          { id: mathTag.id },
          { id: calculusTag.id }
        ]
      }
    },
    create: {
      title: "Calculus I",
      description: "An introduction to differential and integral calculus. This course covers limits, continuity, derivatives, and integrals of algebraic and transcendental functions of one variable, with applications.",
      slug: "calculus-i",
      authorId: teacherId,
      tags: {
        connect: [
          { id: mathTag.id },
          { id: calculusTag.id }
        ]
      }
    },
  })

  const linearAlgebra = await prisma.course.upsert({
    where: { slug: "linear-algebra" },
    update: {
      tags: {
        connect: [
          { id: mathTag.id },
          { id: algebraTag.id }
        ]
      }
    },
    create: {
      title: "Linear Algebra",
      description: "A comprehensive introduction to linear algebra. This course covers systems of linear equations, matrices, determinants, vector spaces, linear transformations, eigenvalues, and eigenvectors.",
      slug: "linear-algebra",
      authorId: teacherId,
      tags: {
        connect: [
          { id: mathTag.id },
          { id: algebraTag.id }
        ]
      }
    },
  })

  const statistics = await prisma.course.upsert({
    where: { slug: "statistics-and-probability" },
    update: {
      tags: {
        connect: [
          { id: mathTag.id },
          { id: statsTag.id }
        ]
      }
    },
    create: {
      title: "Statistics and Probability",
      description: "An introduction to statistics and probability theory. This course covers descriptive statistics, probability distributions, sampling, estimation, hypothesis testing, correlation, and regression.",
      slug: "statistics-and-probability",
      authorId: teacherId,
      tags: {
        connect: [
          { id: mathTag.id },
          { id: statsTag.id }
        ]
      }
    },
  })

  const discreteMath = await prisma.course.upsert({
    where: { slug: "discrete-mathematics" },
    update: {
      tags: {
        connect: [
          { id: mathTag.id },
          { id: discreteTag.id }
        ]
      }
    },
    create: {
      title: "Discrete Mathematics",
      description: "An introduction to discrete mathematics. This course covers logic, set theory, relations, functions, combinatorics, graph theory, and algorithms.",
      slug: "discrete-mathematics",
      authorId: teacherId,
      tags: {
        connect: [
          { id: mathTag.id },
          { id: discreteTag.id }
        ]
      }
    },
  })

  console.log('Courses seeded successfully')
  
  return { calculus1, linearAlgebra, statistics, discreteMath }
} 