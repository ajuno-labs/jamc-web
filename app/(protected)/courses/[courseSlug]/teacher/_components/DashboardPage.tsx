"use client"

import React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { EnrollmentCodeCard } from "./EnrollmentCodeCard"
import { StatsOverview } from "./StatsOverview"
import { WeeklyActivityCard } from "./WeeklyActivityCard"
import { ModuleCompletionCard } from "./ModuleCompletionCard"
import { RecentQuestionsSection } from "./RecentQuestionsSection"
import { EnrollmentChartCard } from "./EnrollmentChartCard"
import { StudentsSection } from "./StudentsSection"
import { ActivityNotificationCard } from "./ActivityNotificationCard"
import type { CourseActivitySummary } from "@/lib/types/student-activity"

export interface DashboardPageProps {
  questions: {
    id: string
    content: string
    slug: string
    createdAt: string
    author: { id: string; name: string }
    _count: { answers: number }
    votes?: { value: number }[]
  }[]
  courses: { slug: string; title: string }[]
  currentCourseSlug: string
  joinCode: string | null
  activitySummary: CourseActivitySummary
}

export function DashboardPage({ 
  questions, 
  courses, 
  currentCourseSlug, 
  joinCode, 
  activitySummary 
}: DashboardPageProps) {
  const selectedCourse = courses.find(c => c.slug === currentCourseSlug)?.title || ''
  const router = useRouter()

  return (
    <div className="w-full bg-muted/40">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Course Dashboard</h1>
          <Separator orientation="vertical" className="h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedCourse}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {courses.map(course => (
                <DropdownMenuItem key={course.slug} onClick={() => router.push(`/courses/${course.slug}/teacher`)}>
                  {course.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button size="sm">Create Announcement</Button>
        </div>
      </header>
      <main className="p-6">
        <EnrollmentCodeCard joinCode={joinCode} />
        <StatsOverview
          studentsCount={activitySummary.totalStudents}
          newThisWeekCount={activitySummary.newStudentsThisWeek}
          activeStudentsCount={activitySummary.activeStudents}
          activeStudentsPercentage={activitySummary.totalStudents > 0 
            ? Math.round((activitySummary.activeStudents / activitySummary.totalStudents) * 100)
            : 0
          }
          openQuestionsCount={questions.length}
          unansweredCount={questions.filter(q => q._count.answers === 0).length}
          averageCompletion={activitySummary.averageProgressPercentage}
          atRiskStudentsCount={activitySummary.atRiskStudents}
          inactiveStudentsCount={activitySummary.inactiveStudents}
        />
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <WeeklyActivityCard />
          <ModuleCompletionCard />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <RecentQuestionsSection questions={questions} currentCourseSlug={currentCourseSlug} />
          <EnrollmentChartCard />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-7">
          <ActivityNotificationCard 
            courseSlug={currentCourseSlug} 
            activitySummary={activitySummary} 
          />
          <div className="lg:col-span-4">
            <StudentsSection currentCourseSlug={currentCourseSlug} activitySummary={activitySummary} />
          </div>
        </div>
      </main>
    </div>
  )
}
