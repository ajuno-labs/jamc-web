"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { markModuleAsCompleted } from "../../../../../_actions/module-actions"
import { useTransition } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ModuleActionsProps {
  moduleId: string
  courseId: string
  userId: string | undefined
}

export function ModuleActions({ moduleId, courseId, userId }: ModuleActionsProps) {
  const [isPending, startTransition] = useTransition()
  
  const handleMarkAsCompleted = () => {
    if (!userId) return
    
    startTransition(async () => {
      try {
        const result = await markModuleAsCompleted(moduleId, userId)
        
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error("Failed to mark module as completed")
        console.error(error)
      }
    })
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userId && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleMarkAsCompleted}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Marking as completed...
              </>
            ) : (
              "Mark as Completed"
            )}
          </Button>
        )}
        <Button variant="outline" className="w-full">Take Practice Quiz</Button>
        <Separator />
        <Link href={`/questions/ask?moduleId=${moduleId}&courseId=${courseId}`}>
          <Button variant="outline" className="w-full">Ask a Question</Button>
        </Link>
      </CardContent>
    </Card>
  )
} 