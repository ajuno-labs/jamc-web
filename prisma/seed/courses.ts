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

  // Create Calculus I course with lessons
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
      },
      lessons: {
        create: [
          {
            title: "Introduction to Limits",
            slug: slugify("Introduction to Limits"),
            theory: `# Introduction to Limits

A limit is the value that a function approaches as the input approaches some value. Limits are essential for understanding continuity, derivatives, and integrals.

## Key Concepts

1. Intuitive understanding of limits
2. Formal definition of limits
3. Techniques for evaluating limits
4. One-sided limits
5. Limits at infinity

The concept of a limit can be expressed mathematically as:

\\[ \\lim_{x \\to a} f(x) = L \\]

This means that as \\(x\\) approaches \\(a\\), the function \\(f(x)\\) approaches the value \\(L\\).`,
            examples: `## Example 1: Evaluating a Basic Limit

Consider the function \\(f(x) = x^2\\). Let's find \\(\\lim_{x \\to 2} f(x)\\).

As \\(x\\) approaches 2:
- When \\(x = 1.9\\), \\(f(1.9) = 3.61\\)
- When \\(x = 1.99\\), \\(f(1.99) = 3.9601\\)
- When \\(x = 2.01\\), \\(f(2.01) = 4.0401\\)
- When \\(x = 2.1\\), \\(f(2.1) = 4.41\\)

We can see that \\(f(x)\\) approaches 4 as \\(x\\) approaches 2.
Therefore, \\(\\lim_{x \\to 2} x^2 = 4\\)`,
            order: 1
          },
          {
            title: "Properties of Limits",
            slug: slugify("Properties of Limits"),
            theory: `# Properties of Limits

Limits follow several important properties that make them easier to work with.

## Basic Properties

For functions \\(f(x)\\) and \\(g(x)\\), and constant \\(c\\):

1. Sum Rule: \\[\\lim_{x \\to a} [f(x) + g(x)] = \\lim_{x \\to a} f(x) + \\lim_{x \\to a} g(x)\\]

2. Product Rule: \\[\\lim_{x \\to a} [f(x) \\cdot g(x)] = \\lim_{x \\to a} f(x) \\cdot \\lim_{x \\to a} g(x)\\]

3. Quotient Rule: \\[\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\frac{\\lim_{x \\to a} f(x)}{\\lim_{x \\to a} g(x)}\\] (when denominator ≠ 0)

4. Constant Multiple: \\[\\lim_{x \\to a} [c \\cdot f(x)] = c \\cdot \\lim_{x \\to a} f(x)\\]`,
            examples: `## Example: Using Limit Properties

Let's evaluate \\(\\lim_{x \\to 1} \\frac{x^2 + 3x}{2x - 1}\\)

1. First, check if we can directly substitute \\(x = 1\\)
2. In numerator: \\(\\lim_{x \\to 1} (x^2 + 3x) = 1^2 + 3(1) = 4\\)
3. In denominator: \\(\\lim_{x \\to 1} (2x - 1) = 2(1) - 1 = 1\\)
4. Since denominator ≠ 0, we can use quotient rule:
   \\[\\lim_{x \\to 1} \\frac{x^2 + 3x}{2x - 1} = \\frac{4}{1} = 4\\]`,
            order: 2
          }
        ]
      }
    },
  })

  // Create Linear Algebra course with lessons
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
      },
      lessons: {
        create: [
          {
            title: "Introduction to Matrices",
            slug: slugify("Introduction to Matrices"),
            theory: `# Introduction to Matrices

A matrix is a rectangular array of numbers arranged in rows and columns. Matrices are fundamental to linear algebra and have numerous applications.

## Matrix Basics

A matrix is written as:

\\[A = \\begin{pmatrix}
a_{11} & a_{12} & \\cdots & a_{1n} \\\\
a_{21} & a_{22} & \\cdots & a_{2n} \\\\
\\vdots & \\vdots & \\ddots & \\vdots \\\\
a_{m1} & a_{m2} & \\cdots & a_{mn}
\\end{pmatrix}\\]

where \\(a_{ij}\\) represents the element in the \\(i\\)th row and \\(j\\)th column.`,
            examples: `## Example: Matrix Operations

Consider the matrices:

\\[A = \\begin{pmatrix}
1 & 2 \\\\
3 & 4
\\end{pmatrix} \\quad
B = \\begin{pmatrix}
5 & 6 \\\\
7 & 8
\\end{pmatrix}\\]

1. Matrix Addition:
\\[A + B = \\begin{pmatrix}
1+5 & 2+6 \\\\
3+7 & 4+8
\\end{pmatrix} = \\begin{pmatrix}
6 & 8 \\\\
10 & 12
\\end{pmatrix}\\]

2. Scalar Multiplication (2A):
\\[2A = \\begin{pmatrix}
2(1) & 2(2) \\\\
2(3) & 2(4)
\\end{pmatrix} = \\begin{pmatrix}
2 & 4 \\\\
6 & 8
\\end{pmatrix}\\]`,
            order: 1
          },
          {
            title: "Matrix Operations",
            slug: slugify("Matrix Operations"),
            theory: `# Matrix Operations

## Matrix Multiplication

The product of two matrices A and B is defined only when the number of columns in A equals the number of rows in B.

For two matrices to be multiplied:
- If A is an m × n matrix
- And B is an p × q matrix
- Then n must equal p
- The resulting matrix will be m × q

The formula for matrix multiplication is:

\\[(AB)_{ij} = \\sum_{k=1}^n a_{ik}b_{kj}\\]`,
            examples: `## Example: Matrix Multiplication

Let's multiply:

\\[A = \\begin{pmatrix}
1 & 2 \\\\
3 & 4
\\end{pmatrix} \\quad
B = \\begin{pmatrix}
5 & 6 \\\\
7 & 8
\\end{pmatrix}\\]

Computing AB:
1. (1×5 + 2×7) = 19
2. (1×6 + 2×8) = 22
3. (3×5 + 4×7) = 43
4. (3×6 + 4×8) = 50

Therefore:
\\[AB = \\begin{pmatrix}
19 & 22 \\\\
43 & 50
\\end{pmatrix}\\]`,
            order: 2
          }
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

  console.log('Courses and lessons seeded successfully')
  
  return { calculus1, linearAlgebra, statistics, discreteMath }
} 