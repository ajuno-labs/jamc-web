"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { QuestionContext } from "@/lib/types/question"
import { CourseStructureType } from "@/lib/types/course-structure"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getVolumesForCourse, getChaptersForVolume, getModulesForChapter, getLessonsForModule, getActivitiesForLesson } from "@/app/(main)/courses/_actions/course-structure-actions"

interface QuestionContextSelectorProps {
  courseId?: string
  onContextChange: (context: QuestionContext) => void
}

interface BreadcrumbItem {
  id: string
  title: string
  type: CourseStructureType
}

interface ContextItem {
  id: string
  title: string
  type: CourseStructureType
}

type ChildItem = {
  id: string
  title: string
  slug: string
}

export function QuestionContextSelector({
  courseId,
  onContextChange,
}: QuestionContextSelectorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [currentItems, setCurrentItems] = useState<ContextItem[]>([])
  const [context, setContext] = useState<QuestionContext>({})

  useEffect(() => {
    if (courseId) {
      loadCourseData(courseId)
    }
  }, [courseId])

  const loadCourseData = async (courseId: string) => {
    try {
      setLoading(true)
      const volumes = await getVolumesForCourse(courseId)
      setCurrentItems(
        volumes.map((volume: ChildItem) => ({
          id: volume.id,
          title: volume.title,
          type: "volume" as CourseStructureType,
        }))
      )
      setBreadcrumbs([
        {
          id: courseId,
          title: "Course",
          type: "course",
        },
      ])
      setContext({ courseId })
      onContextChange({ courseId })
    } catch (err) {
      setError("Failed to load course data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadChildren = async (item: ContextItem) => {
    try {
      setLoading(true)
      let children: ChildItem[] = []
      const nextType = getNextType(item.type)

      switch (item.type) {
        case "volume":
          children = await getChaptersForVolume(item.id)
          break
        case "chapter":
          children = await getModulesForChapter(item.id)
          break
        case "module":
          children = await getLessonsForModule(item.id)
          break
        case "lesson":
          children = await getActivitiesForLesson(item.id)
          break
      }

      setCurrentItems(
        children.map((child) => ({
          id: child.id,
          title: child.title,
          type: nextType,
        }))
      )

      const newBreadcrumbs = [...breadcrumbs, item]
      setBreadcrumbs(newBreadcrumbs)

      const newContext = {
        ...context,
        [`${item.type}Id`]: item.id,
      }
      setContext(newContext)
      onContextChange(newContext)
    } catch (err) {
      setError(`Failed to load ${item.type} data`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getNextType = (currentType: CourseStructureType): CourseStructureType => {
    switch (currentType) {
      case "course":
        return "volume"
      case "volume":
        return "chapter"
      case "chapter":
        return "module"
      case "module":
        return "lesson"
      case "lesson":
        return "activity"
      default:
        return "course"
    }
  }

  const navigateToBreadcrumb = async (index: number) => {
    const item = breadcrumbs[index]
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
    setBreadcrumbs(newBreadcrumbs)

    const newContext: QuestionContext = { courseId: breadcrumbs[0].id }
    for (let i = 1; i <= index; i++) {
      const crumb = breadcrumbs[i]
      newContext[`${crumb.type}Id`] = crumb.id
    }
    setContext(newContext)
    onContextChange(newContext)

    try {
      setLoading(true)
      const nextType = getNextType(item.type)
      let children: ChildItem[] = []

      switch (item.type) {
        case "course":
          children = await getVolumesForCourse(item.id)
          break
        case "volume":
          children = await getChaptersForVolume(item.id)
          break
        case "chapter":
          children = await getModulesForChapter(item.id)
          break
        case "module":
          children = await getLessonsForModule(item.id)
          break
        case "lesson":
          children = await getActivitiesForLesson(item.id)
          break
      }

      setCurrentItems(
        children.map((child) => ({
          id: child.id,
          title: child.title,
          type: nextType,
        }))
      )
    } catch (err) {
      setError(`Failed to load ${item.type} data`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-sm text-destructive">{error}</div>
      </Card>
    )
  }

  const getButtonText = () => {
    if (loading) {
      return <div className="h-4 w-24 bg-muted animate-pulse rounded" />
    }
    if (breadcrumbs.length === 0) {
      return "Select volume"
    }
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]
    return `Select ${getNextType(lastBreadcrumb.type)}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((item, index) => (
          <div key={item.id} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            <Button
              variant="link"
              className="h-auto p-0 text-muted-foreground hover:text-primary"
              onClick={() => navigateToBreadcrumb(index)}
            >
              {item.title}
            </Button>
          </div>
        ))}
      </div>
      {breadcrumbs.length < 6 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {getButtonText()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <ScrollArea className="h-72">
              <div className="p-4 space-y-2">
                {currentItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    onClick={() => {
                      loadChildren(item)
                      setOpen(false)
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
} 