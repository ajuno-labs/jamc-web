import React from "react"
import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth/get-user"
import { CreateCourseForm } from "./_components/create-course-form"
import { getCourseTags } from "./_actions/tag-actions"

export default async function NewCoursePage() {
  const user = await getAuthUser()
  if (!user) {
    redirect("/api/auth/signin")
  }

  // Fetch available tags for courses
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