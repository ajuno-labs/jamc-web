'use client'

import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectSeparator } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Control, UseFormWatch } from 'react-hook-form'
import type { LessonFormValues, Module } from './LessonSummaryClient.types'

interface LessonStructureProps {
  control: Control<LessonFormValues>
  watch: UseFormWatch<LessonFormValues>
  setValue: (name: keyof LessonFormValues, value: string) => void
  modules: Module[]
}

export default function LessonStructure({ control, watch, setValue, modules }: LessonStructureProps) {
  const selectedModuleId = watch('moduleId')
  const selectedChapterId = watch('chapterId')
  const selectedModule = modules.find((m) => m.id === selectedModuleId)

  return (
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
          <>
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
          </>
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
  )
} 