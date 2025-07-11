"use client"

import React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from '@/i18n/navigation'
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
import type { WeeklyActivityData, ModuleProgressData, EnrollmentTrendData } from "@/lib/types/dashboard"

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
  weeklyActivityData: WeeklyActivityData[]
  moduleCompletionData: ModuleProgressData[]
  enrollmentTrendData: EnrollmentTrendData[]
  openQuestionsCount: number
  unansweredCount: number
}

export function DashboardPage({ 
  questions, 
  courses, 
  currentCourseSlug, 
  joinCode, 
  activitySummary,
  weeklyActivityData,
  moduleCompletionData,
  enrollmentTrendData,
  openQuestionsCount,
  unansweredCount,
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
          openQuestionsCount={openQuestionsCount}
          unansweredCount={unansweredCount}
          averageCompletion={activitySummary.averageProgressPercentage}
          atRiskStudentsCount={activitySummary.atRiskStudents}
          inactiveStudentsCount={activitySummary.inactiveStudents}
        />
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <WeeklyActivityCard data={weeklyActivityData} />
          <ModuleCompletionCard data={moduleCompletionData} />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <RecentQuestionsSection questions={questions} currentCourseSlug={currentCourseSlug} />
          <EnrollmentChartCard data={enrollmentTrendData} />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-7">
          <ActivityNotificationCard 
            courseSlug={currentCourseSlug} 
            activitySummary={activitySummary} 
          />
          <div className="lg:col-span-4">
            <StudentsSection currentCourseSlug={currentCourseSlug} />
          </div>
        </div>
      </main>
    </div>
  )
}
