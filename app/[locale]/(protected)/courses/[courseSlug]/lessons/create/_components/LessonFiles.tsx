'use client'

import React from 'react'
import { FormLabel } from '@/components/ui/form'
import { FileUpload, FileGallery } from '.'

interface LessonFilesProps {
  files: File[]
  onFilesSelected: (files: File[]) => void
  onRemove: (file: File) => void
}

export default function LessonFiles({ files, onFilesSelected, onRemove }: LessonFilesProps) {
  return (
    <>
      <div className='mb-6'>
        <FormLabel>Files & Media</FormLabel>
        <FileUpload onFilesSelected={onFilesSelected} />
      </div>
      <FileGallery files={files} onRemove={onRemove} />
    </>
  )
} 