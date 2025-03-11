"use server"

import { prisma } from "@/lib/db/prisma"
import { 
  VolumeWithRelations, 
  ChapterWithRelations, 
  StructuredModuleWithRelations, 
  LessonWithRelations, 
  ActivityWithRelations,
  CourseWithStructure,
  volumeWithRelationsInclude,
  chapterWithRelationsInclude,
  structuredModuleWithRelationsInclude,
  lessonWithRelationsInclude,
  activityWithRelationsInclude,
  courseWithStructureInclude,
  VolumeCardProps,
  ChapterCardProps,
  ModuleCardProps,
  LessonCardProps,
  ActivityCardProps,
  transformVolumeToCardProps,
  transformChapterToCardProps,
  transformModuleToCardProps,
  transformLessonToCardProps,
  transformActivityToCardProps
} from "@/lib/types/course-structure"

/**
 * Get a course with its full structure
 */
export async function getCourseWithStructure(id: string): Promise<CourseWithStructure | null> {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: courseWithStructureInclude
    })
    
    return course
  } catch (error) {
    console.error("Error fetching course with structure:", error)
    return null
  }
}

/**
 * Get all volumes for a course
 */
export async function getVolumesForCourse(courseId: string): Promise<VolumeCardProps[]> {
  try {
    const volumes = await prisma.volume.findMany({
      where: { courseId },
      include: volumeWithRelationsInclude,
      orderBy: { order: 'asc' }
    })
    
    return volumes.map(transformVolumeToCardProps)
  } catch (error) {
    console.error("Error fetching volumes:", error)
    return []
  }
}

/**
 * Get a single volume by ID
 */
export async function getVolumeById(id: string): Promise<VolumeWithRelations | null> {
  try {
    const volume = await prisma.volume.findUnique({
      where: { id },
      include: volumeWithRelationsInclude
    })
    
    return volume
  } catch (error) {
    console.error("Error fetching volume:", error)
    return null
  }
}

/**
 * Get all chapters for a volume
 */
export async function getChaptersForVolume(volumeId: string): Promise<ChapterCardProps[]> {
  try {
    const chapters = await prisma.chapter.findMany({
      where: { volumeId },
      include: chapterWithRelationsInclude,
      orderBy: { order: 'asc' }
    })
    
    return chapters.map(transformChapterToCardProps)
  } catch (error) {
    console.error("Error fetching chapters:", error)
    return []
  }
}

/**
 * Get a single chapter by ID
 */
export async function getChapterById(id: string): Promise<ChapterWithRelations | null> {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: chapterWithRelationsInclude
    })
    
    return chapter
  } catch (error) {
    console.error("Error fetching chapter:", error)
    return null
  }
}

/**
 * Get all modules for a chapter
 */
export async function getModulesForChapter(chapterId: string): Promise<ModuleCardProps[]> {
  try {
    const modules = await prisma.module.findMany({
      where: { chapterId },
      include: structuredModuleWithRelationsInclude,
      orderBy: { order: 'asc' }
    })
    
    return modules.map(transformModuleToCardProps)
  } catch (error) {
    console.error("Error fetching modules:", error)
    return []
  }
}

/**
 * Get a single module by ID
 */
export async function getModuleById(id: string): Promise<StructuredModuleWithRelations | null> {
  try {
    const module = await prisma.module.findUnique({
      where: { id },
      include: structuredModuleWithRelationsInclude
    })
    
    return module
  } catch (error) {
    console.error("Error fetching module:", error)
    return null
  }
}

/**
 * Get all lessons for a module
 */
export async function getLessonsForModule(moduleId: string): Promise<LessonCardProps[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      include: lessonWithRelationsInclude,
      orderBy: { order: 'asc' }
    })
    
    return lessons.map(transformLessonToCardProps)
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return []
  }
}

/**
 * Get a single lesson by ID
 */
export async function getLessonById(id: string): Promise<LessonWithRelations | null> {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: lessonWithRelationsInclude
    })
    
    return lesson
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return null
  }
}

/**
 * Get all activities for a lesson
 */
export async function getActivitiesForLesson(lessonId: string): Promise<ActivityCardProps[]> {
  try {
    const activities = await prisma.activity.findMany({
      where: { lessonId },
      include: activityWithRelationsInclude,
      orderBy: { order: 'asc' }
    })
    
    return activities.map(transformActivityToCardProps)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return []
  }
}

/**
 * Get a single activity by ID
 */
export async function getActivityById(id: string): Promise<ActivityWithRelations | null> {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: activityWithRelationsInclude
    })
    
    return activity
  } catch (error) {
    console.error("Error fetching activity:", error)
    return null
  }
}

/**
 * Create a new volume
 */
export async function createVolume(data: {
  title: string
  overview?: string
  order: number
  courseId: string
}) {
  try {
    // Generate a slug from the title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    const volume = await prisma.volume.create({
      data: {
        ...data,
        slug
      }
    })
    
    return volume
  } catch (error) {
    console.error("Error creating volume:", error)
    throw error
  }
}

/**
 * Create a new chapter
 */
export async function createChapter(data: {
  title: string
  introduction?: string
  summary?: string
  order: number
  volumeId: string
}) {
  try {
    // Generate a slug from the title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    const chapter = await prisma.chapter.create({
      data: {
        ...data,
        slug
      }
    })
    
    return chapter
  } catch (error) {
    console.error("Error creating chapter:", error)
    throw error
  }
}

/**
 * Create a new module
 */
export async function createModule(data: {
  title: string
  content: string
  order: number
  chapterId: string
}) {
  try {
    // Generate a slug from the title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    const module = await prisma.module.create({
      data: {
        ...data,
        slug
      }
    })
    
    return module
  } catch (error) {
    console.error("Error creating module:", error)
    throw error
  }
}

/**
 * Create a new lesson
 */
export async function createLesson(data: {
  title: string
  theory: string
  examples?: string
  order: number
  moduleId: string
}) {
  try {
    // Generate a slug from the title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    const lesson = await prisma.lesson.create({
      data: {
        ...data,
        slug
      }
    })
    
    return lesson
  } catch (error) {
    console.error("Error creating lesson:", error)
    throw error
  }
}

/**
 * Create a new activity
 */
export async function createActivity(data: {
  title: string
  description: string
  problemSet?: string
  hints?: string
  order: number
  lessonId: string
}) {
  try {
    // Generate a slug from the title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    const activity = await prisma.activity.create({
      data: {
        ...data,
        slug
      }
    })
    
    return activity
  } catch (error) {
    console.error("Error creating activity:", error)
    throw error
  }
} 