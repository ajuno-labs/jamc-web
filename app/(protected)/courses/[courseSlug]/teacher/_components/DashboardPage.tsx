"use client"

import React from "react"
import { BookOpen, ChevronDown, GraduationCap, HelpCircle, LayoutDashboard, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { EnrollmentCodeCard } from "./EnrollmentCodeCard"
import { StatsOverview } from "./StatsOverview"
import { WeeklyActivityCard } from "./WeeklyActivityCard"
import { ModuleCompletionCard } from "./ModuleCompletionCard"
import { RecentQuestionsSection } from "./RecentQuestionsSection"
import { EnrollmentChartCard } from "./EnrollmentChartCard"
import { StudentsSection } from "./StudentsSection"

export interface DashboardPageProps {
  students: { id: string; name: string }[]
  questions: {
    id: string
    content: string
    slug: string
    createdAt: string
    author: { id: string; name: string }
    _count: { answers: number }
  }[]
  courses: { slug: string; title: string }[]
  currentCourseSlug: string
  joinCode: string | null
}

export function DashboardPage({ students, questions, courses, currentCourseSlug, joinCode }: DashboardPageProps) {
  const selectedCourse = courses.find(c => c.slug === currentCourseSlug)?.title || ''
  const router = useRouter()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-4 py-2">
              <GraduationCap className="h-6 w-6" />
              <div className="font-semibold">EduQA Platform</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href={`/courses/${currentCourseSlug}/teacher`}>
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/courses">
                        <BookOpen className="h-4 w-4" />
                        <span>Courses</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/courses/${currentCourseSlug}/teacher/questions`}>
                        <HelpCircle className="h-4 w-4" />
                        <span>Q&A Forum</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/courses/${currentCourseSlug}/teacher/students`}>
                        <Users className="h-4 w-4" />
                        <span>Students</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>My Courses</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {courses.map(course => (
                    <SidebarMenuItem key={course.slug}>
                      <SidebarMenuButton asChild isActive={course.slug === currentCourseSlug}>
                        <Link href={`/courses/${course.slug}/teacher`}>
                          <span>{course.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                JD
              </div>
              <div>
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">Instructor</div>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
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
              studentsCount={students.length}
              newThisWeekCount={4}
              activeStudentsCount={64}
              activeStudentsPercentage={73}
              openQuestionsCount={questions.length}
              unansweredCount={questions.filter(q => q._count.answers === 0).length}
              averageCompletion={68}
            />
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <WeeklyActivityCard />
              <ModuleCompletionCard />
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <RecentQuestionsSection questions={questions} currentCourseSlug={currentCourseSlug} />
              <EnrollmentChartCard />
            </div>
            <StudentsSection />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
