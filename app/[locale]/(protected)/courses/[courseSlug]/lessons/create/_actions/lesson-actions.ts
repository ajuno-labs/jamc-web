'use server'

import { getAuthUser } from '@/lib/auth'
import { getEnhancedPrisma } from '@/lib/db/enhanced'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Buffer } from 'buffer'
import { slugify } from '@/lib/utils'
import { notifyNewLesson } from '@/lib/services/notification-triggers'

export async function createLesson(formData: FormData) {
  const user = await getAuthUser()
  if (!user) {
    throw new Error('Authentication required')
  }

  const courseSlug = formData.get('courseSlug')?.toString()
  if (!courseSlug) {
    throw new Error('Course slug is required')
  }

  const prisma = await getEnhancedPrisma()
  const course = await prisma.course.findUnique({ where: { slug: courseSlug } })
  if (!course || course.authorId !== user.id) {
    throw new Error('Unauthorized')
  }

  const bucket = process.env.AWS_S3_BUCKET_NAME!
  const region = process.env.AWS_REGION!
  const s3 = new S3Client({ region })

  // Upload files to S3 and collect URLs
  const files = formData.getAll('files') as File[]
  const fileCreateData: Array<{ url: string; type: string }> = []
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const timestamp = Date.now()
    const key = `courses/${courseSlug}/lessons/${timestamp}-${file.name}`
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ContentLength: buffer.length,
      })
    )
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`
    fileCreateData.push({ url, type: file.type })
  }

  const title = formData.get('title')!.toString()
  const summary = formData.get('summary')!.toString()
  const rawSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const existingCount = await prisma.lesson.count({ where: { courseId: course.id } })
  const order = existingCount + 1

  // Generate a unique slug by appending the order if a lesson already exists
  const slug = existingCount === 0 ? rawSlug : `${rawSlug}-${order}`
  
  const metadataRaw = formData.get('metadata')?.toString() || '{}'
  const metadata = JSON.parse(metadataRaw)

  // Handle module creation or selection
  const moduleId = formData.get('moduleId')?.toString() || ''
  const newModuleTitle = formData.get('newModuleTitle')?.toString().trim() || ''
  let moduleRecord = null
  if (newModuleTitle) {
    // Create a new module
    const lastModule = await prisma.courseModule.findFirst({ where: { courseId: course.id }, orderBy: { order: 'desc' }, select: { order: true } })
    const moduleOrder = lastModule ? lastModule.order + 1 : 1
    const baseModuleSlug = slugify(newModuleTitle)
    let moduleSlug = baseModuleSlug
    let suffix = 1
    while (await prisma.courseModule.findUnique({ where: { courseId_slug: { courseId: course.id, slug: moduleSlug } } })) {
      moduleSlug = `${baseModuleSlug}-${suffix++}`
    }
    moduleRecord = await prisma.courseModule.create({ data: { title: newModuleTitle, slug: moduleSlug, order: moduleOrder, courseId: course.id } })
  } else {
    moduleRecord = await prisma.courseModule.findUnique({ where: { id: moduleId } })
    if (!moduleRecord) throw new Error('Module not found')
  }

  // Handle chapter creation or selection
  const chapterId = formData.get('chapterId')?.toString() || ''
  const newChapterTitle = formData.get('newChapterTitle')?.toString().trim() || ''
  let chapterRecord = null
  if (newChapterTitle) {
    // Create a new chapter
    const lastChapter = await prisma.courseChapter.findFirst({ where: { moduleId: moduleRecord.id }, orderBy: { order: 'desc' }, select: { order: true } })
    const chapterOrder = lastChapter ? lastChapter.order + 1 : 1
    const baseChapterSlug = slugify(newChapterTitle)
    let chapterSlug = baseChapterSlug
    let suffixChap = 1
    while (await prisma.courseChapter.findUnique({ where: { moduleId_slug: { moduleId: moduleRecord.id, slug: chapterSlug } } })) {
      chapterSlug = `${baseChapterSlug}-${suffixChap++}`
    }
    chapterRecord = await prisma.courseChapter.create({ data: { title: newChapterTitle, slug: chapterSlug, order: chapterOrder, moduleId: moduleRecord.id } })
  } else {
    chapterRecord = await prisma.courseChapter.findUnique({ where: { id: chapterId } })
    if (!chapterRecord) throw new Error('Chapter not found')
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      slug,
      summary,
      order,
      metadata,
      course: { connect: { id: course.id } },
      chapter: { connect: { id: chapterRecord.id } },
      files: { create: fileCreateData },
    },
  })

  // Send notification to enrolled students about the new lesson
  try {
    await notifyNewLesson(lesson.id, course.id, user.id)
  } catch (error) {
    console.error('Failed to send new lesson notification:', error)
    // Don't fail the lesson creation if notification fails
  }
} 
