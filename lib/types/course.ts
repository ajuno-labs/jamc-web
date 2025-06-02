import { Prisma } from "@prisma/client"

// Type for basic lesson structure
export type CourseLesson = {
  id: string
  title: string
  content: string
  order: number
  createdAt: Date
}

export type CourseModule = Prisma.CourseModuleGetPayload<{
  include: {
    chapters: {
      include: {
        lessons: true
      }
    }
  }
}>

// Module include object for consistent querying
export const moduleWithRelationsInclude = {
  chapters: {
    include: {
      lessons: true
    }
  }
} satisfies Prisma.CourseModuleInclude

// Type alias for backwards compatibility
export type ModuleWithRelations = CourseModule

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
  lessons: {
    select: {
      id: true,
      title: true,
      order: true,
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
  _count: {
    select: {
      enrollments: true,
    },
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

// Common lesson include object for consistent querying
export const lessonWithRelationsInclude = {
  course: {
    select: {
      id: true,
      title: true,
      slug: true,
      lessons: {
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
} satisfies Prisma.LessonInclude

// Type for lesson with common relations
export type LessonWithRelations = Prisma.LessonGetPayload<{
  include: typeof lessonWithRelationsInclude
}>

// Type for course card display
export type CourseCardProps = {
  id: string
  title: string
  description: string
  slug: string
  lessonCount: number
  enrollmentCount: number
  tags: string[]
  author: {
    id: string
    name: string
    image: string | null
  }
  createdAt: Date
}

// Function to transform a course with relations to course card props
export function transformCourseToCardProps(course: CourseWithRelations): CourseCardProps {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    slug: course.slug,
    lessonCount: course.lessons.length,
    enrollmentCount: course._count.enrollments,
    tags: course.tags.map(tag => tag.name),
    author: {
      id: course.author.id,
      name: course.author.name || 'Unknown',
      image: course.author.image
    },
    createdAt: course.createdAt
  }
}

// Course structure types
export interface Lesson {
  id: string
  title: string
  description?: string
}

export interface Module {
  id: string
  title: string
  description?: string
  lessons: Lesson[]
}

export interface Volume {
  id: string
  title: string
  description?: string
  modules: Module[]
}

export interface CourseStructure {
  volumes: Volume[]
}

// Tag type for courses
export interface CourseTag {
  id: string
  name: string
  description: string | null
  count: number
} 