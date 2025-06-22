'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import LessonHeader from '../create/_components/LessonHeader'
import LessonBasics from '../create/_components/LessonBasics'
import LessonStructure from '../create/_components/LessonStructure'
import LessonFiles from '../create/_components/LessonFiles'
import { MetadataSection } from '../create/_components/MetadataSection'
import LessonActions from '../create/_components/LessonActions'
import { useRouter } from '@/i18n/navigation'
import type { LessonFormProps, LessonFormValues } from './LessonForm.types'
import { MathContent } from '@/components/MathContent'

export default function LessonForm({
  courseSlug,
  courseId,
  modules,
  initialValues,
  initialTags,
  initialReadingTime,
  initialFiles,
  onSubmit,
  redirectUrl,
  lessonId,
}: LessonFormProps) {
  const router = useRouter()
  const form = useForm<LessonFormValues>({
    defaultValues:
      initialValues || {
        title: '',
        summary: '',
        moduleId: '',
        chapterId: '',
        newModuleTitle: '',
        newChapterTitle: '',
      },
  })
  const { handleSubmit, control, watch, setValue } = form
  const summary = watch('summary')
  const [files, setFiles] = useState<File[]>(initialFiles ?? [])
  const [tags, setTags] = useState<string>(initialTags ?? '')
  const [readingTime, setReadingTime] = useState<string>(initialReadingTime ?? '')

  async function handleFormSubmit(data: LessonFormValues) {
    const formData = new FormData()
    formData.append('courseSlug', courseSlug)
    formData.append('courseId', courseId)
    if (lessonId) {
      formData.append('lessonId', lessonId)
    }
    formData.append('moduleId', data.moduleId)
    formData.append('chapterId', data.chapterId)
    formData.append('title', data.title)
    formData.append('summary', data.summary)
    formData.append('newModuleTitle', data.newModuleTitle)
    formData.append('newChapterTitle', data.newChapterTitle)
    files.forEach((file) => formData.append('files', file))
    formData.append(
      'metadata',
      JSON.stringify({
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        readingTime: readingTime ? Number(readingTime) : null,
      }),
    )
    await onSubmit(formData)
    router.push(redirectUrl)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="min-h-screen flex flex-col bg-background dark:bg-background text-foreground">
        <input type="hidden" name="courseSlug" value={courseSlug} />
        <input type="hidden" name="courseId" value={courseId} />
        {lessonId && <input type="hidden" name="lessonId" value={lessonId} />}

        <main className="flex-1 container max-w-4xl mx-auto py-6 px-4 sm:px-6">
          <LessonHeader courseSlug={courseSlug} />

          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 mt-4">
            <LessonBasics control={control} />
            <div className="mt-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Summary Preview</h3>
              <MathContent content={summary} className="prose" />
            </div>
            <LessonStructure control={control} watch={watch} setValue={setValue} modules={modules} />
            <LessonFiles
              files={files}
              onFilesSelected={(selectedFiles: File[]) => setFiles((prev) => [...prev, ...selectedFiles])}
              onRemove={(file: File) => setFiles((prev) => prev.filter((f) => f !== file))}
            />
            <MetadataSection tags={tags} readingTime={readingTime} onTagsChange={setTags} onReadingTimeChange={setReadingTime} />
            <LessonActions lastSaved="2 minutes ago" />
          </div>
        </main>
      </form>
    </Form>
  )
} 