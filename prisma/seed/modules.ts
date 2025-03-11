import { prisma, slugify } from './utils'

export async function seedModules(
  calculus1Id: string, 
  linearAlgebraId: string, 
  statisticsId: string, 
  discreteMathId: string
) {
  console.log('Seeding modules...')
  
  // Create modules for Calculus I
  const limitsModule = await prisma.module.create({
    data: {
      title: 'Introduction to Limits',
      slug: slugify('Introduction to Limits'),
      content: 'This module covers the fundamental concept of limits in calculus.\n\nA limit is the value that a function approaches as the input approaches some value. Limits are essential for understanding continuity, derivatives, and integrals.\n\nWe will explore:\n- Intuitive understanding of limits\n- Formal definition of limits\n- Techniques for evaluating limits\n- One-sided limits\n- Limits at infinity\n\nThe concept of a limit can be expressed mathematically as:\n\n$$\\lim_{x \\to a} f(x) = L$$\n\nThis means that as $x$ approaches $a$, the function $f(x)$ approaches the value $L$.',
      order: 1,
      courseId: calculus1Id
    }
  })

  await prisma.module.create({
    data: {
      title: 'Derivatives and Differentiation',
      slug: slugify('Derivatives and Differentiation'),
      content: 'This module explores derivatives, which measure the rate of change of a function.\n\nThe derivative of a function $f(x)$ is defined as:\n\n$$f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\n\nWe will cover:\n- Definition of the derivative\n- Basic differentiation rules\n- Product and quotient rules\n- Chain rule\n- Implicit differentiation\n- Applications of derivatives',
      order: 2,
      courseId: calculus1Id
    }
  })

  await prisma.module.create({
    data: {
      title: 'Applications of Derivatives',
      slug: slugify('Applications of Derivatives'),
      content: 'This module covers practical applications of derivatives in various fields.\n\nDerivatives have numerous applications, including:\n\n1. Finding rates of change\n2. Determining the slope of a curve at a point\n3. Optimization problems (finding maxima and minima)\n4. Related rates problems\n5. Linear approximations\n\nWe\'ll explore how to use derivatives to solve real-world problems in physics, economics, and engineering.',
      order: 3,
      courseId: calculus1Id
    }
  })

  await prisma.module.create({
    data: {
      title: 'Integration',
      slug: slugify('Integration'),
      content: 'This module introduces integration, the reverse process of differentiation.\n\nThe indefinite integral of a function $f(x)$ is written as:\n\n$$\\int f(x) \\, dx = F(x) + C$$\n\nwhere $F(x)$ is a function whose derivative is $f(x)$, and $C$ is a constant.\n\nWe will cover:\n- Antiderivatives and indefinite integrals\n- Basic integration rules\n- Integration by substitution\n- Definite integrals and the Fundamental Theorem of Calculus\n- Applications of integration',
      order: 4,
      courseId: calculus1Id
    }
  })

  // Create modules for Linear Algebra
  await prisma.module.create({
    data: {
      title: 'Systems of Linear Equations',
      slug: slugify('Systems of Linear Equations'),
      content: 'This module introduces systems of linear equations and methods for solving them.\n\nA system of linear equations can be written in the form:\n\n$$\\begin{align}\na_{11}x_1 + a_{12}x_2 + \\cdots + a_{1n}x_n &= b_1 \\\\\na_{21}x_1 + a_{22}x_2 + \\cdots + a_{2n}x_n &= b_2 \\\\\n\\vdots \\\\\na_{m1}x_1 + a_{m2}x_2 + \\cdots + a_{mn}x_n &= b_m\n\\end{align}$$\n\nWe will explore:\n- Gaussian elimination\n- Gauss-Jordan elimination\n- Matrix representation of linear systems\n- Solution sets and their geometric interpretation',
      order: 1,
      courseId: linearAlgebraId
    }
  })

  const matricesModule = await prisma.module.create({
    data: {
      title: 'Matrices and Matrix Operations',
      slug: slugify('Matrices and Matrix Operations'),
      content: 'This module covers matrices and operations on matrices.\n\nA matrix is a rectangular array of numbers. For example, a 2×3 matrix might look like:\n\n$$A = \\begin{pmatrix}\n1 & 2 & 3 \\\\\n4 & 5 & 6\n\\end{pmatrix}$$\n\nWe will explore:\n- Matrix addition and scalar multiplication\n- Matrix multiplication\n- Special matrices (identity, zero, diagonal, triangular)\n- Matrix transpose\n- Matrix inverse',
      order: 2,
      courseId: linearAlgebraId
    }
  })

  await prisma.module.create({
    data: {
      title: 'Determinants and Matrix Inverses',
      slug: slugify('Determinants and Matrix Inverses'),
      content: 'This module explores determinants and their applications in finding matrix inverses.\n\nThe determinant of a square matrix is a scalar value that provides important information about the matrix. For a 2×2 matrix, the determinant is calculated as:\n\n$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$\n\nWe will cover:\n- Properties of determinants\n- Calculating determinants of larger matrices\n- Using determinants to find matrix inverses\n- Applications of determinants in solving systems of equations',
      order: 3,
      courseId: linearAlgebraId
    }
  })

  // Create modules for Statistics
  await prisma.module.create({
    data: {
      title: 'Introduction to Probability',
      slug: slugify('Introduction to Probability'),
      content: 'This module introduces the fundamental concepts of probability theory.\n\nProbability is a measure of the likelihood that an event will occur. It is quantified as a number between 0 and 1, where 0 indicates impossibility and 1 indicates certainty.\n\nWe will explore:\n- Sample spaces and events\n- Axioms of probability\n- Conditional probability\n- Independence\n- Bayes\' theorem',
      order: 1,
      courseId: statisticsId
    }
  })

  await prisma.module.create({
    data: {
      title: 'Random Variables and Distributions',
      slug: slugify('Random Variables and Distributions'),
      content: 'This module covers random variables and probability distributions.\n\nA random variable is a variable whose value is subject to variations due to chance. A probability distribution assigns probabilities to the possible values of a random variable.\n\nWe will explore:\n- Discrete and continuous random variables\n- Probability mass functions and probability density functions\n- Cumulative distribution functions\n- Expected value and variance\n- Common distributions (binomial, Poisson, normal, exponential)',
      order: 2,
      courseId: statisticsId
    }
  })

  // Create modules for Discrete Mathematics
  await prisma.module.create({
    data: {
      title: 'Logic and Proofs',
      slug: slugify('Logic and Proofs'),
      content: 'This module introduces propositional and predicate logic, and techniques for constructing mathematical proofs.\n\nLogic is the foundation of mathematical reasoning. We will explore:\n- Propositional logic (statements, connectives, truth tables)\n- Predicate logic (quantifiers, variables, predicates)\n- Rules of inference\n- Direct proofs\n- Proof by contradiction\n- Mathematical induction',
      order: 1,
      courseId: discreteMathId
    }
  })

  await prisma.module.create({
    data: {
      title: 'Set Theory',
      slug: slugify('Set Theory'),
      content: 'This module covers the fundamentals of set theory.\n\nA set is a collection of distinct objects. Set theory provides the language and notation for describing and working with collections of objects.\n\nWe will explore:\n- Set notation and operations (union, intersection, complement, difference)\n- Venn diagrams\n- Set identities\n- Power sets\n- Cartesian products\n- Relations and functions as sets',
      order: 2,
      courseId: discreteMathId
    }
  })

  console.log('Modules seeded successfully')
  
  return { limitsModule, matricesModule }
} 