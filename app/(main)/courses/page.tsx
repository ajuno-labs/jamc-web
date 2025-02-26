"use client"

import { useState, useEffect } from "react"
import { getCourses, getTopics, getTeachers } from "./_actions/course-actions"
import { CourseCard, CourseCardProps } from "./components/course-card"
import { CourseFilters, Topic, Teacher } from "./components/course-filters"
import { CourseSkeleton } from "./components/course-skeleton"

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [topicFilter, setTopicFilter] = useState("all")
  const [teacherFilter, setTeacherFilter] = useState("all")
  const [courses, setCourses] = useState<CourseCardProps[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data on initial load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [coursesData, topicsData, teachersData] = await Promise.all([
          getCourses(),
          getTopics(),
          getTeachers()
        ])
        setCourses(coursesData)
        setTopics(topicsData)
        setTeachers(teachersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch filtered courses when filters change
  useEffect(() => {
    const fetchFilteredCourses = async () => {
      setLoading(true)
      try {
        const filteredCourses = await getCourses({
          searchTerm: searchTerm || undefined,
          topic: topicFilter !== "all" ? topicFilter : undefined,
          teacherId: teacherFilter !== "all" ? teacherFilter : undefined
        })
        setCourses(filteredCourses)
      } catch (error) {
        console.error("Error fetching filtered courses:", error)
      } finally {
        setLoading(false)
      }
    }

    // Debounce the search to avoid too many requests
    const handler = setTimeout(() => {
      fetchFilteredCourses()
    }, 300)

    return () => clearTimeout(handler)
  }, [searchTerm, topicFilter, teacherFilter])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mathematics Courses</h1>

      {/* Search and filters */}
      <CourseFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        topicFilter={topicFilter}
        setTopicFilter={setTopicFilter}
        teacherFilter={teacherFilter}
        setTeacherFilter={setTeacherFilter}
        topics={topics}
        teachers={teachers}
      />

      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <CourseSkeleton />
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
} 