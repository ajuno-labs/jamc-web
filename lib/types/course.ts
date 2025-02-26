import { Prisma } from "@prisma/client"

// Common course include object for consistent querying
export const courseWithRelationsInclude = {
  author: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  tags: {
    select: {
      id: true,
      name: true,
    },
  },
  modules: {
    select: {
      id: true,
      title: true,
      content: true,
      order: true,
      createdAt: true,
    },
    orderBy: {
      order: 'asc',
    },
  },
  questions: {
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          answers: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  },
} satisfies Prisma.CourseInclude

// Type for course with common relations
export type CourseWithRelations = Prisma.CourseGetPayload<{
  include: typeof courseWithRelationsInclude
}>

// Type for questions in a course
export type CourseQuestion = {
  id: string
  title: string
  slug: string
  createdAt: Date
  author: {
    name: string | null
    image: string | null
  }
  _count: {
    answers: number
  }
}

// Common module include object for consistent querying
export const moduleWithRelationsInclude = {
  course: {
    select: {
      id: true,
      title: true,
      slug: true,
      modules: {
        select: {
          id: true,
          title: true,
          order: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  },
  questions: {
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      author: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          answers: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
  },
} satisfies Prisma.ModuleInclude

// Type for module with common relations
export type ModuleWithRelations = Prisma.ModuleGetPayload<{
  include: typeof moduleWithRelationsInclude
}>

// Type for questions in a module
export type ModuleQuestion = {
  id: string
  title: string
  slug: string
  createdAt: Date
  author: {
    name: string | null
  }
  _count: {
    answers: number
  }
}

// Type for course card display
export type CourseCardProps = {
  id: string
  title: string
  description: string
  slug: string
  modules: number
  questions: number
  topics: string[]
  teacher: string
  teacherId: string
  teacherImage: string | null
}

// Function to transform a course with relations to course card props
export function transformCourseToCardProps(course: CourseWithRelations): CourseCardProps {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    slug: course.slug,
    modules: course.modules.length,
    questions: course.questions.length,
    topics: course.tags.map(tag => tag.name),
    teacher: course.author.name || 'Unknown',
    teacherId: course.author.id,
    teacherImage: course.author.image
  }
} 