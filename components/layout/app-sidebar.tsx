"use client"

import * as React from "react"
import { BookOpen, GraduationCap, HelpCircle, LayoutDashboard, Users } from "lucide-react"
import { Link, usePathname } from "@/i18n/navigation"
import { useTranslations } from 'next-intl'

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

/**
 * Renders the application sidebar with navigation links, displaying general and course management sections based on the current URL path.
 *
 * The sidebar adapts its content to show teacher-specific navigation when viewing a course management page. All labels and menu items are localized using the 'Layout' translation namespace.
 */
export function AppSidebar() {
  const pathname = usePathname()
  const t = useTranslations('Layout')

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
      title: t('qa'),
      url: "/questions",
      icon: HelpCircle,
    },
    {
      title: t('courses'),
      url: "/courses",
      icon: BookOpen,
    },
  ]

  // Teacher-specific navigation items
  const teacherNavigationItems = currentCourseSlug ? [
    {
      title: t('dashboard'),
      url: `/courses/${currentCourseSlug}/teacher`,
      icon: LayoutDashboard,
    },
    {
      title: t('qaForum'),
      url: `/courses/${currentCourseSlug}/teacher/questions`,
      icon: HelpCircle,
    },
    {
      title: t('students'),
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
        <SidebarGroupLabel>{t('navigation')}</SidebarGroupLabel>
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
            <SidebarGroupLabel>{t('courseManagement')}</SidebarGroupLabel>
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
