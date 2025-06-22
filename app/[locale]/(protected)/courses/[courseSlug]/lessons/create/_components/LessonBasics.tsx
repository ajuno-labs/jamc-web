'use client'

import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '.'
import type { Control } from 'react-hook-form'
import type { LessonFormValues } from './LessonSummaryClient.types'

interface LessonBasicsProps {
  control: Control<LessonFormValues>
}

export default function LessonBasics({ control }: LessonBasicsProps) {
  return (
    <>
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
    </>
  )
} 