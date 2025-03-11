"use server"

import { prisma } from "@/lib/db/prisma"
import { CourseWithRelations } from "@/lib/types/course"
import { 
  CourseWithStructure, 
  VolumeWithRelations, 
  ChapterWithRelations,
  StructuredModuleWithRelations,
  LessonWithRelations,
  ActivityWithRelations,
  VolumeCardProps,
  ChapterCardProps,
  ModuleCardProps,
  LessonCardProps,
  ActivityCardProps,
  courseWithStructureInclude,
  volumeWithRelationsInclude,
  chapterWithRelationsInclude,
  structuredModuleWithRelationsInclude,
  lessonWithRelationsInclude,
  activityWithRelationsInclude,
  transformVolumeToCardProps,
  transformChapterToCardProps,
  transformModuleToCardProps,
  transformLessonToCardProps,
  transformActivityToCardProps
} from "@/lib/types/course-structure"

/**
 * Get a course by ID with related data
 */
export async function getCourseById(id: string): Promise<CourseWithRelations | null> {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        modules: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
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
      },
    })
    
    return course
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  }
}

/**
 * Check if a user is enrolled in a course
 */
export async function checkEnrollmentStatus(courseId: string): Promise<{ isEnrolled: boolean }> {
  // This is a placeholder - implement actual enrollment check logic
  return { isEnrolled: false }
}

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