'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { MetadataSection, LessonHeader, LessonBasics, LessonStructure, LessonFiles, LessonActions } from '.'
import { useRouter } from 'next/navigation'
import { createLesson } from '../_actions/lesson-actions'
import type { Module, LessonFormValues } from './LessonSummaryClient.types'

interface LessonSummaryClientProps {
  courseSlug: string
  courseId: string
  modules: Module[]
}

export default function LessonSummaryClient({ courseSlug, courseId, modules }: LessonSummaryClientProps) {
  const router = useRouter()
  const form = useForm<LessonFormValues>({ defaultValues: { title: '', summary: '', moduleId: '', chapterId: '', newModuleTitle: '', newChapterTitle: '' } })
  const { handleSubmit, control, watch, setValue } = form
  // State for file uploads and metadata
  const [files, setFiles] = useState<File[]>([])
  const [tags, setTags] = useState<string>('')
  const [readingTime, setReadingTime] = useState<string>('')

  async function onSubmit(data: LessonFormValues) {
    const formData = new FormData()
    formData.append('courseSlug', courseSlug)
    formData.append('courseId', courseId)
    formData.append('moduleId', data.moduleId)
    formData.append('chapterId', data.chapterId)
    formData.append('title', data.title)
    formData.append('summary', data.summary)
    formData.append('newModuleTitle', data.newModuleTitle)
    formData.append('newChapterTitle', data.newChapterTitle)
    // Append uploaded files
    files.forEach((file) => formData.append('files', file))
    // Append metadata as JSON
    formData.append('metadata', JSON.stringify({ tags: tags.split(',').map(t => t.trim()).filter(Boolean), readingTime: readingTime ? Number(readingTime) : null }))
    // TODO: integrate files from FileUpload into formData
    await createLesson(formData)
    router.push(`/courses/${courseSlug}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='min-h-screen flex flex-col bg-background dark:bg-background text-foreground'>
        <input type='hidden' name='courseSlug' value={courseSlug} />
        <input type='hidden' name='courseId' value={courseId} />

        <main className='flex-1 container max-w-4xl mx-auto py-6 px-4 sm:px-6'>
          <LessonHeader courseSlug={courseSlug} />

          <div className='bg-card text-card-foreground rounded-lg shadow-sm p-6 mt-4'>
            <LessonBasics control={control} />
            <LessonStructure control={control} watch={watch} setValue={setValue} modules={modules} />
            <LessonFiles files={files} onFilesSelected={(selectedFiles) => setFiles((prev) => [...prev, ...selectedFiles])} onRemove={(file) => setFiles((prev) => prev.filter((f) => f !== file))} />
            <MetadataSection tags={tags} readingTime={readingTime} onTagsChange={setTags} onReadingTimeChange={setReadingTime} />
            <LessonActions lastSaved='2 minutes ago' />
          </div>
        </main>
      </form>
    </Form>
  )
} 