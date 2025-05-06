import React from "react"
import { CreateCourseForm } from "./_components/CreateCourseForm"
import { getCourseTags } from "./_actions/tag-actions"

export default async function NewCoursePage() {

  const availableTags = await getCourseTags()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
      <div className="bg-white p-6 rounded shadow">
        <CreateCourseForm availableTags={availableTags} />
      </div>
    </div>
  )
} 