import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Utility function for generating slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .trim()                   // Trim whitespace
}

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

  // Create additional teachers
  const teacher2 = await prisma.user.upsert({
    where: { email: 'prof.johnson@example.com' },
    update: {
      password: hashedPassword,
      roles: {
        connect: { id: teacherRole.id },
      },
    },
    create: {
      email: 'prof.johnson@example.com',
      name: 'Prof. Johnson',
      password: hashedPassword,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johnson',
      roles: {
        connect: { id: teacherRole.id },
      },
    },
  })

  const teacher3 = await prisma.user.upsert({
    where: { email: 'dr.chen@example.com' },
    update: {
      password: hashedPassword,
      roles: {
        connect: { id: teacherRole.id },
      },
    },
    create: {
      email: 'dr.chen@example.com',
      name: 'Dr. Chen',
      password: hashedPassword,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
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

  // Create tags for courses
  await Promise.all([
    prisma.tag.upsert({
      where: { name: 'mathematics' },
      update: { description: 'Questions about math concepts' },
      create: { name: 'mathematics', description: 'Questions about math concepts' },
    }),
    prisma.tag.upsert({
      where: { name: 'geometry' },
      update: { description: 'Topics related to shapes and spaces' },
      create: { name: 'geometry', description: 'Topics related to shapes and spaces' },
    }),
    prisma.tag.upsert({
      where: { name: 'calculus' },
      update: { description: 'Questions about calculus' },
      create: { name: 'calculus', description: 'Questions about calculus' },
    }),
    prisma.tag.upsert({
      where: { name: 'algebra' },
      update: { description: 'Topics related to algebraic structures' },
      create: { name: 'algebra', description: 'Topics related to algebraic structures' },
    }),
    prisma.tag.upsert({
      where: { name: 'statistics' },
      update: { description: 'Topics related to data analysis and probability' },
      create: { name: 'statistics', description: 'Topics related to data analysis and probability' },
    }),
    prisma.tag.upsert({
      where: { name: 'discrete-math' },
      update: { description: 'Topics related to discrete mathematical structures' },
      create: { name: 'discrete-math', description: 'Topics related to discrete mathematical structures' },
    }),
  ])

  // Create courses
  // Calculus I
  const calculus1 = await prisma.course.create({
    data: {
      title: 'Calculus I',
      description: 'Introduction to limits, derivatives, and integrals with applications to physics and engineering problems.',
      slug: 'calculus-i',
      authorId: teacher.id,
      tags: {
        connect: [
          { name: 'mathematics' },
          { name: 'calculus' }
        ]
      }
    }
  })

  // Create modules for Calculus I
  const limitsModule = await prisma.module.create({
    data: {
      title: 'Introduction to Limits',
      content: 'This module covers the fundamental concept of limits in calculus.\n\nA limit is the value that a function approaches as the input approaches some value. Limits are essential for understanding continuity, derivatives, and integrals.\n\nWe will explore:\n- Intuitive understanding of limits\n- Formal definition of limits\n- Techniques for evaluating limits\n- One-sided limits\n- Limits at infinity\n\nThe concept of a limit can be expressed mathematically as:\n\n$$\\lim_{x \\to a} f(x) = L$$\n\nThis means that as $x$ approaches $a$, the function $f(x)$ approaches the value $L$.',
      order: 1,
      courseId: calculus1.id
    }
  })

  await prisma.module.create({
    data: {
      title: 'Derivatives and Differentiation',
      content: 'This module explores derivatives, which measure the rate of change of a function.\n\nThe derivative of a function $f(x)$ is defined as:\n\n$$f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\n\nWe will cover:\n- Definition of the derivative\n- Basic differentiation rules\n- Product and quotient rules\n- Chain rule\n- Implicit differentiation\n- Applications of derivatives',
      order: 2,
      courseId: calculus1.id
    }
  })

  await prisma.module.create({
    data: {
      title: 'Applications of Derivatives',
      content: 'This module covers practical applications of derivatives in various fields.\n\nDerivatives have numerous applications, including:\n\n1. Finding rates of change\n2. Determining the slope of a curve at a point\n3. Optimization problems (finding maxima and minima)\n4. Related rates problems\n5. Linear approximations\n\nWe\'ll explore how to use derivatives to solve real-world problems in physics, economics, and engineering.',
      order: 3,
      courseId: calculus1.id
    }
  })

  await prisma.module.create({
    data: {
      title: 'Integration',
      content: 'This module introduces integration, the reverse process of differentiation.\n\nThe indefinite integral of a function $f(x)$ is written as:\n\n$$\\int f(x) \\, dx = F(x) + C$$\n\nwhere $F(x)$ is a function whose derivative is $f(x)$, and $C$ is a constant.\n\nWe will cover:\n- Antiderivatives and indefinite integrals\n- Basic integration rules\n- Integration by substitution\n- Definite integrals and the Fundamental Theorem of Calculus\n- Applications of integration',
      order: 4,
      courseId: calculus1.id
    }
  })

  // Linear Algebra
  const linearAlgebra = await prisma.course.create({
    data: {
      title: 'Linear Algebra',
      description: 'Study of vector spaces, linear transformations, matrices, and systems of linear equations with applications.',
      slug: 'linear-algebra',
      authorId: teacher2.id,
      tags: {
        connect: [
          { name: 'mathematics' },
          { name: 'algebra' }
        ]
      }
    }
  })

  await prisma.module.create({
    data: {
      title: 'Systems of Linear Equations',
      content: 'This module introduces systems of linear equations and methods for solving them.\n\nA system of linear equations can be written in the form:\n\n$$\\begin{align}\na_{11}x_1 + a_{12}x_2 + \\cdots + a_{1n}x_n &= b_1 \\\\\na_{21}x_1 + a_{22}x_2 + \\cdots + a_{2n}x_n &= b_2 \\\\\n\\vdots \\\\\na_{m1}x_1 + a_{m2}x_2 + \\cdots + a_{mn}x_n &= b_m\n\\end{align}$$\n\nWe will explore:\n- Gaussian elimination\n- Gauss-Jordan elimination\n- Matrix representation of linear systems\n- Solution sets and their geometric interpretation',
      order: 1,
      courseId: linearAlgebra.id
    }
  })

  const matricesModule = await prisma.module.create({
    data: {
      title: 'Matrices and Matrix Operations',
      content: 'This module covers matrices and operations on matrices.\n\nA matrix is a rectangular array of numbers. For example, a 2×3 matrix might look like:\n\n$$A = \\begin{pmatrix}\n1 & 2 & 3 \\\\\n4 & 5 & 6\n\\end{pmatrix}$$\n\nWe will explore:\n- Matrix addition and scalar multiplication\n- Matrix multiplication\n- Special matrices (identity, zero, diagonal, triangular)\n- Matrix transpose\n- Matrix inverse',
      order: 2,
      courseId: linearAlgebra.id
    }
  })

  await prisma.module.create({
    data: {
      title: 'Determinants and Matrix Inverses',
      content: 'This module explores determinants and their applications in finding matrix inverses.\n\nThe determinant of a square matrix is a scalar value that provides important information about the matrix. For a 2×2 matrix, the determinant is calculated as:\n\n$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$\n\nWe will cover:\n- Properties of determinants\n- Calculating determinants of larger matrices\n- Using determinants to find matrix inverses\n- Applications of determinants in solving systems of equations',
      order: 3,
      courseId: linearAlgebra.id
    }
  })

  // Probability Theory
  const probabilityTheory = await prisma.course.create({
    data: {
      title: 'Probability Theory',
      description: 'Fundamentals of probability, random variables, distributions, and statistical inference for data analysis.',
      slug: 'probability-theory',
      authorId: teacher3.id,
      tags: {
        connect: [
          { name: 'mathematics' },
          { name: 'statistics' }
        ]
      }
    }
  })

  await prisma.module.create({
    data: {
      title: 'Introduction to Probability',
      content: 'This module introduces the fundamental concepts of probability theory.\n\nProbability is a measure of the likelihood that an event will occur. It is quantified as a number between 0 and 1, where 0 indicates impossibility and 1 indicates certainty.\n\nWe will explore:\n- Sample spaces and events\n- Axioms of probability\n- Conditional probability\n- Independence\n- Bayes\' theorem',
      order: 1,
      courseId: probabilityTheory.id
    }
  })

  await prisma.module.create({
    data: {
      title: 'Random Variables and Distributions',
      content: 'This module covers random variables and probability distributions.\n\nA random variable is a variable whose value is subject to variations due to chance. A probability distribution assigns probabilities to the possible values of a random variable.\n\nWe will explore:\n- Discrete and continuous random variables\n- Probability mass functions and probability density functions\n- Cumulative distribution functions\n- Expected value and variance\n- Common distributions (binomial, Poisson, normal, exponential)',
      order: 2,
      courseId: probabilityTheory.id
    }
  })

  // Discrete Mathematics
  const discreteMath = await prisma.course.create({
    data: {
      title: 'Discrete Mathematics',
      description: 'Introduction to mathematical structures like sets, logic, combinatorics, and graph theory for computer science.',
      slug: 'discrete-mathematics',
      authorId: teacher.id,
      tags: {
        connect: [
          { name: 'mathematics' },
          { name: 'discrete-math' }
        ]
      }
    }
  })

  await prisma.module.create({
    data: {
      title: 'Logic and Proofs',
      content: 'This module introduces propositional and predicate logic, and techniques for constructing mathematical proofs.\n\nLogic is the foundation of mathematical reasoning. We will explore:\n- Propositional logic (statements, connectives, truth tables)\n- Predicate logic (quantifiers, variables, predicates)\n- Rules of inference\n- Direct proofs\n- Proof by contradiction\n- Mathematical induction',
      order: 1,
      courseId: discreteMath.id
    }
  })

  await prisma.module.create({
    data: {
      title: 'Set Theory',
      content: 'This module covers the fundamentals of set theory.\n\nA set is a collection of distinct objects. Set theory provides the language and notation for describing and working with collections of objects.\n\nWe will explore:\n- Set notation and operations (union, intersection, complement, difference)\n- Venn diagrams\n- Set identities\n- Power sets\n- Cartesian products\n- Relations and functions as sets',
      order: 2,
      courseId: discreteMath.id
    }
  })

  // Create questions
  const question1Title = "Understanding the Pythagorean Theorem"
  const question1 = await prisma.question.create({
    data: {
      title: question1Title,
      slug: slugify(question1Title),
      content: "Can someone explain how the Pythagorean theorem relates to real-world applications? I understand the basic formula a² + b² = c², but I'm struggling to see its practical uses.",
      type: "FORMAL",
      visibility: "PUBLIC",
      topic: "Mathematics",
      authorId: student.id,
      tags: {
        connect: [
          { name: "mathematics" },
          { name: "geometry" },
        ],
      },
    },
  })

  // Question 2
  const question2Title = "Quick question about derivatives"
  await prisma.question.create({
    data: {
      title: question2Title,
      slug: slugify(question2Title),
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

  // Create course-related questions
  const question3Title = "Trouble understanding limits"
  await prisma.question.create({
    data: {
      title: question3Title,
      slug: slugify(question3Title),
      content: "I'm having trouble understanding the epsilon-delta definition of limits. Can someone provide an intuitive explanation?",
      type: "FORMAL",
      visibility: "PUBLIC",
      authorId: student.id,
      courseId: calculus1.id,
      moduleId: limitsModule.id,
      tags: {
        connect: [
          { name: "mathematics" },
          { name: "calculus" },
        ],
      },
    },
  })

  const question4Title = "Matrix multiplication order"
  await prisma.question.create({
    data: {
      title: question4Title,
      slug: slugify(question4Title),
      content: "Why does the order matter in matrix multiplication? And what's the intuition behind the rule for determining the dimensions of the resulting matrix?",
      type: "FORMAL",
      visibility: "PUBLIC",
      authorId: student.id,
      courseId: linearAlgebra.id,
      moduleId: matricesModule.id,
      tags: {
        connect: [
          { name: "mathematics" },
          { name: "algebra" },
        ],
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
