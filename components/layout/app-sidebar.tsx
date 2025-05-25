"use client"

import * as React from "react"
import { BookOpen, GraduationCap, HelpCircle, LayoutDashboard, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  // Check if we're on a teacher page
  const isTeacherPage = pathname.includes('/teacher')
  const courseSlugMatch = pathname.match(/\/courses\/([^\/]+)\/teacher/)
  const currentCourseSlug = courseSlugMatch ? courseSlugMatch[1] : null

  const navigationItems = [
    {
      title: "Q&A",
      url: "/questions",
      icon: HelpCircle,
    },
    {
      title: "Courses",
      url: "/courses",
      icon: BookOpen,
    },
  ]

  // Teacher-specific navigation items
  const teacherNavigationItems = currentCourseSlug ? [
    {
      title: "Dashboard",
      url: `/courses/${currentCourseSlug}/teacher`,
      icon: LayoutDashboard,
    },
    {
      title: "Q&A Forum",
      url: `/courses/${currentCourseSlug}/teacher/questions`,
      icon: HelpCircle,
    },
    {
      title: "Students",
      url: `/courses/${currentCourseSlug}/teacher/students`,
      icon: Users,
    },
  ] : []

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <GraduationCap className="h-6 w-6" />
          <Link href="/" className="font-bold text-xl">
            JAMC
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Teacher-specific navigation */}
        {isTeacherPage && teacherNavigationItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Course Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {teacherNavigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      

    </Sidebar>
  )
} 