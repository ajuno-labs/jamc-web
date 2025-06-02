'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

interface LessonActionsProps {
  lastSaved: string
}

export default function LessonActions({ lastSaved }: LessonActionsProps) {
  return (
    <div className='flex items-center justify-between mt-8 pt-4 border-t border-gray-200'>
      <div className='text-sm text-gray-500'>Last saved {lastSaved}</div>
      <div className='flex space-x-3'>
        <Button type='button' variant='outline' className='flex items-center'>
          <Save className='h-4 w-4 mr-2' />
          Save Draft
        </Button>
        <Button type='submit'>Publish Summary</Button>
      </div>
    </div>
  )
} 