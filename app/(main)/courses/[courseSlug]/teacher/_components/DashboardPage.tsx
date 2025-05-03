"use client"

import { useState } from "react"
import { BookOpen, ChevronDown, GraduationCap, HelpCircle, LayoutDashboard, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnrollmentChart } from "./EnrollmentChart"
import { QuestionsList } from "./QuestionsList"
import { StudentsList } from "./StudentsList"
import { WeeklyActivityChart } from "./WeeklyActivityChart"
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
}

export function DashboardPage({ students, questions }: DashboardPageProps) {
  const [selectedCourse, setSelectedCourse] = useState("Web Development Fundamentals")

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
                      <a href="#">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <BookOpen className="h-4 w-4" />
                        <span>Courses</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <HelpCircle className="h-4 w-4" />
                        <span>Q&A Forum</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Users className="h-4 w-4" />
                        <span>Students</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>My Courses</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <a href="#">
                        <span>Web Development Fundamentals</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <span>Data Science Basics</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <span>UX Design Principles</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
                  <DropdownMenuItem onClick={() => setSelectedCourse("Web Development Fundamentals")}>
                    Web Development Fundamentals
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCourse("Data Science Basics")}>
                    Data Science Basics
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCourse("UX Design Principles")}>
                    UX Design Principles
                  </DropdownMenuItem>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <p className="text-xs text-muted-foreground">+4 new this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Students (7 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">64</div>
                  <p className="text-xs text-muted-foreground">73% of total students</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Open Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <p className="text-xs text-muted-foreground">{questions.filter(q => q._count.answers === 0).length} unanswered</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <Progress value={68} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Student logins and engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <WeeklyActivityChart />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Module Completion</CardTitle>
                  <CardDescription>Progress through course modules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div>Module 1: HTML Basics</div>
                        <div className="font-medium">98%</div>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div>Module 2: CSS Fundamentals</div>
                        <div className="font-medium">87%</div>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div>Module 3: JavaScript Intro</div>
                        <div className="font-medium">76%</div>
                      </div>
                      <Progress value={76} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div>Module 4: DOM Manipulation</div>
                        <div className="font-medium">54%</div>
                      </div>
                      <Progress value={54} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div>Module 5: API Integration</div>
                        <div className="font-medium">23%</div>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Questions</CardTitle>
                    <CardDescription>Latest student questions from the course</CardDescription>
                  </div>
                  <Tabs defaultValue="all">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                      <TabsTrigger value="flagged">Flagged</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <QuestionsList questions={questions} />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Questions
                  </Button>
                </CardFooter>
              </Card>
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Student Enrollment</CardTitle>
                  <CardDescription>New enrollments and student activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <EnrollmentChart />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>Manage and monitor student progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <StudentsList />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Export List</Button>
                  <Button>Message All</Button>
                </CardFooter>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
