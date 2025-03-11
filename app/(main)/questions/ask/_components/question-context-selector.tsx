"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { QuestionContext, QuestionContextBreadcrumb } from "@/lib/types/question"
import { Badge } from "@/components/ui/badge"

interface QuestionContextSelectorProps {
  courseId?: string
  onContextChange: (context: QuestionContext) => void
}

export default function QuestionContextSelector({
  courseId,
  onContextChange,
}: QuestionContextSelectorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<QuestionContextBreadcrumb[]>([])
  const [currentItems, setCurrentItems] = useState<QuestionContextBreadcrumb[]>([])
  const [context, setContext] = useState<QuestionContext>({ courseId })

  // Load initial course data if courseId is provided
  useEffect(() => {
    if (courseId) {
      loadCourseData(courseId)
    }
  }, [courseId])

  // Load course data and set initial breadcrumb
  const loadCourseData = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/courses/${id}`)
      const data = await response.json()
      
      setBreadcrumbs([{
        id: data.id,
        title: data.title,
        type: 'course',
        slug: data.slug
      }])
      
      if (data.volumes?.length > 0) {
        setCurrentItems(data.volumes.map((v: any) => ({
          id: v.id,
          title: v.title,
          type: 'volume',
          slug: v.slug
        })))
      } else if (data.modules?.length > 0) {
        setCurrentItems(data.modules.map((m: any) => ({
          id: m.id,
          title: m.title,
          type: 'module',
          slug: m.slug
        })))
      }
    } catch (err) {
      setError("Failed to load course data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Load children items based on selected item
  const loadChildren = async (item: QuestionContextBreadcrumb) => {
    try {
      setLoading(true)
      let endpoint = ''
      
      switch (item.type) {
        case 'volume':
          endpoint = `/api/volumes/${item.id}/chapters`
          break
        case 'chapter':
          endpoint = `/api/chapters/${item.id}/modules`
          break
        case 'module':
          endpoint = `/api/modules/${item.id}/lessons`
          break
        case 'lesson':
          endpoint = `/api/lessons/${item.id}/activities`
          break
        default:
          return
      }
      
      const response = await fetch(endpoint)
      const data = await response.json()
      
      // Map the data to our context item format
      const items = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        type: getNextType(item.type),
        slug: d.slug
      }))
      
      setCurrentItems(items)
      
      // Update breadcrumbs
      const index = breadcrumbs.findIndex(b => b.id === item.id)
      if (index === -1) {
        setBreadcrumbs([...breadcrumbs, item])
      } else {
        setBreadcrumbs(breadcrumbs.slice(0, index + 1))
      }
      
      // Update context
      const newContext: QuestionContext = { courseId }
      breadcrumbs.forEach(b => {
        switch (b.type) {
          case 'volume':
            newContext.volumeId = b.id
            break
          case 'chapter':
            newContext.chapterId = b.id
            break
          case 'module':
            newContext.moduleId = b.id
            break
          case 'lesson':
            newContext.lessonId = b.id
            break
          case 'activity':
            newContext.activityId = b.id
            break
        }
      })
      setContext(newContext)
      onContextChange(newContext)
      
    } catch (err) {
      setError("Failed to load items")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Get the next type in the hierarchy
  const getNextType = (currentType: string): QuestionContextBreadcrumb['type'] => {
    switch (currentType) {
      case 'course':
        return 'volume'
      case 'volume':
        return 'chapter'
      case 'chapter':
        return 'module'
      case 'module':
        return 'lesson'
      case 'lesson':
        return 'activity'
      default:
        return 'course'
    }
  }

  // Navigate to a specific breadcrumb
  const navigateToBreadcrumb = async (index: number) => {
    const item = breadcrumbs[index]
    if (!item) return
    
    await loadChildren(item)
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb navigation */}
      <div className="flex flex-wrap gap-2 items-center">
        {breadcrumbs.map((item, index) => (
          <div key={item.id} className="flex items-center">
            <Badge
              variant={index === breadcrumbs.length - 1 ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => navigateToBreadcrumb(index)}
            >
              {item.title}
            </Badge>
            {index < breadcrumbs.length - 1 && (
              <ChevronsUpDown className="h-4 w-4 mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* Item selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            disabled={loading || currentItems.length === 0}
          >
            {loading ? "Loading..." : "Select an item..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search items..." />
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {currentItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => {
                    loadChildren(item)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      context[`${item.type}Id` as keyof QuestionContext] === item.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
} 