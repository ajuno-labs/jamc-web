import { Prisma } from "@prisma/client"

// Volume includes
export const volumeWithRelationsInclude = {
  course: {
    select: {
      id: true,
      title: true,
      slug: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  },
  chapters: {
    select: {
      id: true,
      title: true,
      order: true,
      slug: true,
    },
    orderBy: {
      order: 'asc',
    },
  },
} satisfies Prisma.VolumeInclude

// Volume type with relations
export type VolumeWithRelations = Prisma.VolumeGetPayload<{
  include: typeof volumeWithRelationsInclude
}>

// Chapter includes
export const chapterWithRelationsInclude = {
  volume: {
    select: {
      id: true,
      title: true,
      slug: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  },
  modules: {
    select: {
      id: true,
      title: true,
      order: true,
      slug: true,
    },
    orderBy: {
      order: 'asc',
    },
  },
} satisfies Prisma.ChapterInclude

// Chapter type with relations
export type ChapterWithRelations = Prisma.ChapterGetPayload<{
  include: typeof chapterWithRelationsInclude
}>

// Module includes for the new structure
export const structuredModuleWithRelationsInclude = {
  chapter: {
    select: {
      id: true,
      title: true,
      slug: true,
      volume: {
        select: {
          id: true,
          title: true,
          slug: true,
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  },
  lessons: {
    select: {
      id: true,
      title: true,
      order: true,
      slug: true,
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

// Module type with relations for the new structure
export type StructuredModuleWithRelations = Prisma.ModuleGetPayload<{
  include: typeof structuredModuleWithRelationsInclude
}>

// Lesson includes
export const lessonWithRelationsInclude = {
  module: {
    select: {
      id: true,
      title: true,
      slug: true,
      chapter: {
        select: {
          id: true,
          title: true,
          slug: true,
          volume: {
            select: {
              id: true,
              title: true,
              slug: true,
              course: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  },
  activities: {
    select: {
      id: true,
      title: true,
      order: true,
      slug: true,
    },
    orderBy: {
      order: 'asc',
    },
  },
} satisfies Prisma.LessonInclude

// Lesson type with relations
export type LessonWithRelations = Prisma.LessonGetPayload<{
  include: typeof lessonWithRelationsInclude
}>

// Activity includes
export const activityWithRelationsInclude = {
  lesson: {
    select: {
      id: true,
      title: true,
      slug: true,
      module: {
        select: {
          id: true,
          title: true,
          slug: true,
          chapter: {
            select: {
              id: true,
              title: true,
              slug: true,
              volume: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  course: {
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ActivityInclude

// Activity type with relations
export type ActivityWithRelations = Prisma.ActivityGetPayload<{
  include: typeof activityWithRelationsInclude
}>

// Update the course include to include volumes
export const courseWithStructureInclude = {
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
  volumes: {
    select: {
      id: true,
      title: true,
      overview: true,
      order: true,
      slug: true,
      chapters: {
        select: {
          id: true,
          title: true,
          order: true,
          slug: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
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

// Course type with structure
export type CourseWithStructure = Prisma.CourseGetPayload<{
  include: typeof courseWithStructureInclude
}>

// Types for UI components
export type VolumeCardProps = {
  id: string
  title: string
  overview: string | null
  slug: string
  chapterCount: number
  courseId: string
  courseTitle: string
  courseSlug: string
}

export type ChapterCardProps = {
  id: string
  title: string
  introduction: string | null
  slug: string
  moduleCount: number
  volumeId: string
  volumeTitle: string
  volumeSlug: string
  courseId: string
  courseTitle: string
  courseSlug: string
}

export type ModuleCardProps = {
  id: string
  title: string
  content: string
  slug: string
  lessonCount: number
  chapterId: string | null
  chapterTitle: string | null
  chapterSlug: string | null
  volumeId: string | null
  volumeTitle: string | null
  volumeSlug: string | null
  courseId: string
  courseTitle: string
  courseSlug: string
}

export type LessonCardProps = {
  id: string
  title: string
  slug: string
  activityCount: number
  moduleId: string
  moduleTitle: string
  moduleSlug: string
  chapterId: string | null
  chapterTitle: string | null
  chapterSlug: string | null
  volumeId: string | null
  volumeTitle: string | null
  volumeSlug: string | null
  courseId: string
  courseTitle: string
  courseSlug: string
}

export type ActivityCardProps = {
  id: string
  title: string
  slug: string
  lessonId: string
  lessonTitle: string
  lessonSlug: string
  moduleId: string
  moduleTitle: string
  moduleSlug: string
  chapterId: string | null
  chapterTitle: string | null
  chapterSlug: string | null
  volumeId: string | null
  volumeTitle: string | null
  volumeSlug: string | null
  courseId: string
  courseTitle: string
  courseSlug: string
}

// Helper functions to transform data for UI components
export function transformVolumeToCardProps(volume: VolumeWithRelations): VolumeCardProps {
  return {
    id: volume.id,
    title: volume.title,
    overview: volume.overview,
    slug: volume.slug,
    chapterCount: volume.chapters.length,
    courseId: volume.course.id,
    courseTitle: volume.course.title,
    courseSlug: volume.course.slug,
  }
}

export function transformChapterToCardProps(chapter: ChapterWithRelations): ChapterCardProps {
  return {
    id: chapter.id,
    title: chapter.title,
    introduction: chapter.introduction,
    slug: chapter.slug,
    moduleCount: chapter.modules.length,
    volumeId: chapter.volume.id,
    volumeTitle: chapter.volume.title,
    volumeSlug: chapter.volume.slug,
    courseId: chapter.volume.course.id,
    courseTitle: chapter.volume.course.title,
    courseSlug: chapter.volume.course.slug,
  }
}

export function transformModuleToCardProps(module: StructuredModuleWithRelations): ModuleCardProps {
  return {
    id: module.id,
    title: module.title,
    content: module.content,
    slug: module.slug,
    lessonCount: module.lessons.length,
    chapterId: module.chapter?.id || null,
    chapterTitle: module.chapter?.title || null,
    chapterSlug: module.chapter?.slug || null,
    volumeId: module.chapter?.volume.id || null,
    volumeTitle: module.chapter?.volume.title || null,
    volumeSlug: module.chapter?.volume.slug || null,
    courseId: module.chapter?.volume.course.id || '',
    courseTitle: module.chapter?.volume.course.title || '',
    courseSlug: module.chapter?.volume.course.slug || '',
  }
}

export function transformLessonToCardProps(lesson: LessonWithRelations): LessonCardProps {
  return {
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    activityCount: lesson.activities.length,
    moduleId: lesson.module.id,
    moduleTitle: lesson.module.title,
    moduleSlug: lesson.module.slug,
    chapterId: lesson.module.chapter?.id || null,
    chapterTitle: lesson.module.chapter?.title || null,
    chapterSlug: lesson.module.chapter?.slug || null,
    volumeId: lesson.module.chapter?.volume.id || null,
    volumeTitle: lesson.module.chapter?.volume.title || null,
    volumeSlug: lesson.module.chapter?.volume.slug || null,
    courseId: lesson.module.chapter?.volume.course.id || '',
    courseTitle: lesson.module.chapter?.volume.course.title || '',
    courseSlug: lesson.module.chapter?.volume.course.slug || '',
  }
}

export function transformActivityToCardProps(activity: ActivityWithRelations): ActivityCardProps {
  return {
    id: activity.id,
    title: activity.title,
    slug: activity.slug,
    lessonId: activity.lesson.id,
    lessonTitle: activity.lesson.title,
    lessonSlug: activity.lesson.slug,
    moduleId: activity.lesson.module.id,
    moduleTitle: activity.lesson.module.title,
    moduleSlug: activity.lesson.module.slug,
    chapterId: activity.lesson.module.chapter?.id || null,
    chapterTitle: activity.lesson.module.chapter?.title || null,
    chapterSlug: activity.lesson.module.chapter?.slug || null,
    volumeId: activity.lesson.module.chapter?.volume.id || null,
    volumeTitle: activity.lesson.module.chapter?.volume.title || null,
    volumeSlug: activity.lesson.module.chapter?.volume.slug || null,
    courseId: activity.lesson.module.chapter?.volume.course.id || '',
    courseTitle: activity.lesson.module.chapter?.volume.course.title || '',
    courseSlug: activity.lesson.module.chapter?.volume.course.slug || '',
  }
} 