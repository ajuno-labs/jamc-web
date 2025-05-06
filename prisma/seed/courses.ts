import { prisma, slugify } from "./utils";

export async function seedCourses(teacherId: string) {
  console.log("Seeding courses...");

  // Create tags
  const mathTag = await prisma.tag.upsert({
    where: { name: "Mathematics" },
    update: {},
    create: {
      name: "Mathematics",
      description: "Topics related to mathematics",
    },
  });

  const calculusTag = await prisma.tag.upsert({
    where: { name: "Calculus" },
    update: {},
    create: {
      name: "Calculus",
      description: "Topics related to calculus",
    },
  });

  const algebraTag = await prisma.tag.upsert({
    where: { name: "Linear Algebra" },
    update: {},
    create: {
      name: "Linear Algebra",
      description: "Topics related to linear algebra",
    },
  });

  const statsTag = await prisma.tag.upsert({
    where: { name: "Statistics" },
    update: {},
    create: {
      name: "Statistics",
      description: "Topics related to statistics and probability",
    },
  });

  const discreteTag = await prisma.tag.upsert({
    where: { name: "Discrete Mathematics" },
    update: {},
    create: {
      name: "Discrete Mathematics",
      description: "Topics related to discrete mathematics",
    },
  });

  // Create Calculus I course with lessons
  const calculus1 = await prisma.course.upsert({
    where: { slug: "calculus-i" },
    update: {
      tags: {
        connect: [{ id: mathTag.id }, { id: calculusTag.id }],
      },
    },
    create: {
      title: "Calculus I",
      description:
        "An introduction to differential and integral calculus. This course covers limits, continuity, derivatives, and integrals of algebraic and transcendental functions of one variable, with applications.",
      slug: "calculus-i",
      authorId: teacherId,
      tags: {
        connect: [{ id: mathTag.id }, { id: calculusTag.id }],
      },
      structure: [
        {
          id: slugify("Part 1: Limits"),
          type: "module",
          title: "Part 1: Limits",
          children: [
            {
              id: slugify("Introduction to Limits"),
              type: "lesson",
              title: "Introduction to Limits",
              children: [],
            },
            {
              id: slugify("Properties of Limits"),
              type: "lesson",
              title: "Properties of Limits",
              children: [],
            },
          ],
        },
      ],
      lessons: {
        create: [
          {
            id: slugify("Introduction to Limits"),
            title: "Introduction to Limits",
            slug: slugify("Introduction to Limits"),
            summary: `# Introduction to Limits

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
            order: 1,
          },
          {
            id: slugify("Properties of Limits"),
            title: "Properties of Limits",
            slug: slugify("Properties of Limits"),
            summary: `# Properties of Limits

Limits follow several important properties that make them easier to work with.

## Basic Properties

For functions \\(f(x)\\) and \\(g(x)\\), and constant \\(c\\):

1. Sum Rule: \\[\\lim_{x \\to a} [f(x) + g(x)] = \\lim_{x \\to a} f(x) + \\lim_{x \\to a} g(x)\\]

2. Product Rule: \\[\\lim_{x \\to a} [f(x) \\cdot g(x)] = \\lim_{x \\to a} f(x) \\cdot \\lim_{x \\to a} g(x)\\]

3. Quotient Rule: \\[\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\frac{\\lim_{x \\to a} f(x)}{\\lim_{x \\to a} g(x)}\\] (when denominator ≠ 0)

4. Constant Multiple: \\[\\lim_{x \\to a} [c \\cdot f(x)] = c \\cdot \\lim_{x \\to a} f(x)\\]`,
            order: 2,
          },
        ],
      },
    },
  });

  // Create Linear Algebra course with lessons
  const linearAlgebra = await prisma.course.upsert({
    where: { slug: "linear-algebra" },
    update: {
      tags: {
        connect: [{ id: mathTag.id }, { id: algebraTag.id }],
      },
    },
    create: {
      title: "Linear Algebra",
      description:
        "A comprehensive introduction to linear algebra. This course covers systems of linear equations, matrices, determinants, vector spaces, linear transformations, eigenvalues, and eigenvectors.",
      slug: "linear-algebra",
      authorId: teacherId,
      tags: {
        connect: [{ id: mathTag.id }, { id: algebraTag.id }],
      },
      structure: [
        {
          id: slugify("Part 1: Matrices"),
          type: "module",
          title: "Part 1: Matrices",
          children: [
            {
              id: slugify("Introduction to Matrices"),
              type: "lesson",
              title: "Introduction to Matrices",
              children: [],
            },
            {
              id: slugify("Matrix Operations"),
              type: "lesson",
              title: "Matrix Operations",
              children: [],
            },
          ],
        },
      ],
      lessons: {
        create: [
          {
            id: slugify("Introduction to Matrices"),
            title: "Introduction to Matrices",
            slug: slugify("Introduction to Matrices"),
            summary: `# Introduction to Matrices

A matrix is a rectangular array of numbers arranged in rows and columns. Matrices are fundamental to linear algebra and have numerous applications.

## Matrix Basics

A matrix is written as:

\\[A = \\begin{pmatrix}
a_{11} & a_{12} & \\cdots & a_{1n} \\ a_{21} & a_{22} & \\cdots & a_{2n} \\ \\vdots & \\vdots & \\ddots & \\vdots \\ a_{m1} & a_{m2} & \\cdots & a_{mn}\\end{pmatrix}\\]`,
            order: 1,
          },
          {
            id: slugify("Matrix Operations"),
            title: "Matrix Operations",
            slug: slugify("Matrix Operations"),
            summary: `# Matrix Operations

The product of two matrices A and B is defined only when the number of columns in A equals the number of rows in B.

\\[(AB)_{ij} = \\sum_{k=1}^n a_{ik}b_{kj}\\]`,
            order: 2,
          },
        ],
      },
    },
  });

  const statistics = await prisma.course.upsert({
    where: { slug: "statistics-and-probability" },
    update: {
      tags: {
        connect: [{ id: mathTag.id }, { id: statsTag.id }],
      },
    },
    create: {
      title: "Statistics and Probability",
      description:
        "An introduction to statistics and probability theory. This course covers descriptive statistics, probability distributions, sampling, estimation, hypothesis testing, correlation, and regression.",
      slug: "statistics-and-probability",
      authorId: teacherId,
      tags: {
        connect: [{ id: mathTag.id }, { id: statsTag.id }],
      },
    },
  });

  const discreteMath = await prisma.course.upsert({
    where: { slug: "discrete-mathematics" },
    update: {
      tags: {
        connect: [{ id: mathTag.id }, { id: discreteTag.id }],
      },
    },
    create: {
      title: "Discrete Mathematics",
      description:
        "An introduction to discrete mathematics. This course covers logic, set theory, relations, functions, combinatorics, graph theory, and algorithms.",
      slug: "discrete-mathematics",
      authorId: teacherId,
      tags: {
        connect: [{ id: mathTag.id }, { id: discreteTag.id }],
      },
    },
  });

  console.log("Courses and lessons seeded successfully");

  return { calculus1, linearAlgebra, statistics, discreteMath };
}
