import { prisma, slugify } from './utils'

export async function seedCourseStructure(calculus1Id: string) {
  console.log('Seeding course structure...')
  
  // Create a volume for Calculus I
  const calculusVolume = await prisma.volume.create({
    data: {
      title: 'Fundamentals of Calculus',
      overview: 'This volume covers the fundamental concepts of calculus, including limits, derivatives, and integrals.',
      order: 1,
      slug: slugify('Fundamentals of Calculus'),
      courseId: calculus1Id
    }
  })
  
  // Create chapters for the volume
  const limitsChapter = await prisma.chapter.create({
    data: {
      title: 'Limits and Continuity',
      introduction: 'This chapter introduces the concept of limits and continuity, which are foundational to calculus.',
      summary: 'Limits describe the behavior of a function as its input approaches a particular value. Continuity extends this concept to describe functions that have no "breaks" or "jumps".',
      order: 1,
      slug: slugify('Limits and Continuity'),
      volumeId: calculusVolume.id
    }
  })
  
  const derivativesChapter = await prisma.chapter.create({
    data: {
      title: 'Derivatives',
      introduction: 'This chapter explores derivatives, which measure the rate of change of a function.',
      summary: 'Derivatives are a fundamental tool in calculus that allow us to analyze how functions change. They have numerous applications in physics, economics, and other fields.',
      order: 2,
      slug: slugify('Derivatives'),
      volumeId: calculusVolume.id
    }
  })
  
  const integralsChapter = await prisma.chapter.create({
    data: {
      title: 'Integrals',
      introduction: 'This chapter covers integration, the reverse process of differentiation.',
      summary: 'Integration allows us to find the area under a curve, the volume of a solid, and solve many other problems involving accumulation.',
      order: 3,
      slug: slugify('Integrals'),
      volumeId: calculusVolume.id
    }
  })
  
  // Create modules for the Limits chapter
  const limitsModule = await prisma.module.create({
    data: {
      title: 'Introduction to Limits',
      content: 'This module introduces the concept of limits in calculus.',
      order: 1,
      slug: slugify('Introduction to Limits'),
      chapterId: limitsChapter.id
    }
  })
  
  const continuityModule = await prisma.module.create({
    data: {
      title: 'Continuity',
      content: 'This module explores the concept of continuity and its relationship to limits.',
      order: 2,
      slug: slugify('Continuity'),
      chapterId: limitsChapter.id
    }
  })
  
  // Create lessons for the Limits module
  const limitDefinitionLesson = await prisma.lesson.create({
    data: {
      title: 'Definition of a Limit',
      theory: 'This lesson covers the formal and intuitive definitions of limits.',
      examples: 'We will work through several examples of evaluating limits using various techniques.',
      order: 1,
      slug: slugify('Definition of a Limit'),
      moduleId: limitsModule.id
    }
  })
  
  const limitPropertiesLesson = await prisma.lesson.create({
    data: {
      title: 'Properties of Limits',
      theory: 'This lesson explores the properties of limits, including the sum, product, and quotient rules.',
      examples: 'We will apply these properties to evaluate complex limits.',
      order: 2,
      slug: slugify('Properties of Limits'),
      moduleId: limitsModule.id
    }
  })
  
  // Create activities for the Limit Definition lesson
  await prisma.activity.create({
    data: {
      title: 'Evaluating Basic Limits',
      description: 'Practice evaluating limits of polynomial and rational functions.',
      problemSet: 'Evaluate the following limits:\n1. $\\lim_{x \\to 2} (3x^2 - 4x + 1)$\n2. $\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$\n3. $\\lim_{x \\to 0} \\frac{\\sin x}{x}$',
      hints: 'For problem 2, try factoring the numerator. For problem 3, recall that $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$.',
      order: 1,
      slug: slugify('Evaluating Basic Limits'),
      lessonId: limitDefinitionLesson.id
    }
  })
  
  await prisma.activity.create({
    data: {
      title: 'Finding Limits Graphically',
      description: 'Determine limits by analyzing graphs of functions.',
      problemSet: 'For each graph, determine the limit as x approaches the given value.',
      order: 2,
      slug: slugify('Finding Limits Graphically'),
      lessonId: limitDefinitionLesson.id
    }
  })
  
  console.log('Course structure seeded successfully')
  
  return {
    calculusVolume,
    limitsChapter,
    derivativesChapter,
    integralsChapter,
    limitsModule,
    continuityModule,
    limitDefinitionLesson,
    limitPropertiesLesson
  }
} 