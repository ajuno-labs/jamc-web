'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Breadcrumb, FileUpload, FileGallery, MetadataSection, RichTextEditor } from '.'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createLesson } from '../_actions/lesson-actions'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectSeparator } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface LessonSummaryClientProps {
  courseSlug: string
  courseId: string
  modules: {
    id: string
    title: string
    slug: string
    chapters: {
      id: string
      title: string
      slug: string
    }[]
  }[]
}

type LessonFormValues = {
  title: string
  summary: string
  moduleId: string
  chapterId: string
  newModuleTitle: string
  newChapterTitle: string
}

export default function LessonSummaryClient({ courseSlug, courseId, modules }: LessonSummaryClientProps) {
  const router = useRouter()
  const form = useForm<LessonFormValues>({ defaultValues: { title: '', summary: '', moduleId: '', chapterId: '', newModuleTitle: '', newChapterTitle: '' } })
  const { handleSubmit, control, watch, setValue } = form
  const selectedModuleId = watch('moduleId')
  const selectedChapterId = watch('chapterId')
  const selectedModule = modules.find((m) => m.id === selectedModuleId)
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
          <div className='flex items-center mb-6'>
            <Link href={`/courses/${courseSlug}`} className='flex items-center text-sm text-gray-600 hover:text-gray-900'>
              <ArrowLeft className='h-4 w-4 mr-1' />
              Back to course
            </Link>
          </div>

          <Breadcrumb />

          <div className='bg-card text-card-foreground rounded-lg shadow-sm p-6 mt-4'>
            <FormField
              control={control}
              name='title'
              rules={{ required: 'Lesson title is required' }}
              render={({ field }) => (
                <FormItem className='mb-6'>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter lesson title...' className='w-full' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='summary'
              rules={{ required: 'Lesson summary is required' }}
              render={({ field }) => (
                <FormItem className='mb-6'>
                  <FormLabel>Lesson Summary</FormLabel>
                  <FormControl>
                    <RichTextEditor value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className='mb-6'>
              <CardHeader>
                <CardTitle>Lesson Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name='moduleId'
                  rules={{ required: 'Please select a module or add new' }}
                  render={({ field }) => (
                    <FormItem className='mb-4'>
                      <FormLabel>Module</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => { field.onChange(value); if (value !== 'new') setValue('newModuleTitle', '') }}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select or add module' />
                          </SelectTrigger>
                          <SelectContent>
                            {modules.map((mod) => (
                              <SelectItem key={mod.id} value={mod.id}>
                                {mod.title}
                              </SelectItem>
                            ))}
                            <SelectSeparator />
                            <SelectItem value='new'>+ Add new module</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedModuleId === 'new' && (
                  <FormField
                    control={control}
                    name='newModuleTitle'
                    rules={{ required: 'Please enter module title' }}
                    render={({ field }) => (
                      <FormItem className='mb-4'>
                        <FormLabel>New Module Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder='Module Title' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedModuleId !== 'new' && (
                  <>
                    <FormField
                      control={control}
                      name='chapterId'
                      rules={{ required: 'Please select a chapter or add new' }}
                      render={({ field }) => (
                        <FormItem className='mb-4'>
                          <FormLabel>Chapter</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => { field.onChange(value); if (value !== 'newChapter') setValue('newChapterTitle', '') }}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Select or add chapter' />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedModule?.chapters.map((chap) => (
                                  <SelectItem key={chap.id} value={chap.id}>
                                    {chap.title}
                                  </SelectItem>
                                ))}
                                <SelectSeparator />
                                <SelectItem value='newChapter'>+ Add new chapter</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {selectedChapterId === 'newChapter' && (
                      <FormField
                        control={control}
                        name='newChapterTitle'
                        rules={{ required: 'Please enter chapter title' }}
                        render={({ field }) => (
                          <FormItem className='mb-4'>
                            <FormLabel>New Chapter Title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder='Chapter Title' />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <div className='mb-6'>
              <FormLabel>Files & Media</FormLabel>
              <FileUpload onFilesSelected={(selectedFiles) => setFiles((prev) => [...prev, ...selectedFiles])} />
            </div>

            <FileGallery files={files} onRemove={(fileToRemove) => setFiles((prev) => prev.filter((f) => f !== fileToRemove))} />

            <MetadataSection tags={tags} readingTime={readingTime} onTagsChange={setTags} onReadingTimeChange={setReadingTime} />

            <div className='flex items-center justify-between mt-8 pt-4 border-t border-gray-200'>
              <div className='text-sm text-gray-500'>Last saved 2 minutes ago</div>
              <div className='flex space-x-3'>
                <Button type='button' variant='outline' className='flex items-center'>
                  <Save className='h-4 w-4 mr-2' />
                  Save Draft
                </Button>
                <Button type='submit'>Publish Summary</Button>
              </div>
            </div>
          </div>
        </main>
      </form>
    </Form>
  )
} 