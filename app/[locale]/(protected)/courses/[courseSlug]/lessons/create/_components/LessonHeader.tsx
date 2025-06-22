'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import { Breadcrumb } from '.'

interface LessonHeaderProps {
  courseSlug: string
}

export default function LessonHeader({ courseSlug }: LessonHeaderProps) {
  return (
    <>
      <div className='flex items-center mb-6'>
        <Link href={`/courses/${courseSlug}`} className='flex items-center text-sm text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-1' />
          Back to course
        </Link>
      </div>
      <Breadcrumb />
    </>
  )
} 