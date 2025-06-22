"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { enrollInCourse, unenrollFromCourse } from "../../_actions/enrollment-actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface EnrollButtonProps {
  courseId: string
  isEnrolled: boolean
  isLoggedIn: boolean
}

export default function EnrollButton({ courseId, isEnrolled, isLoggedIn }: EnrollButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  
  const handleEnrollment = async () => {
    if (!isLoggedIn) {
      // Redirect to login page with return URL
      router.push(`/signin?returnUrl=/courses/${courseId}`)
      return
    }
    
    setIsPending(true)
    
    try {
      if (isEnrolled) {
        // Unenroll from course
        const result = await unenrollFromCourse(courseId)
        
        if (result.success) {
          toast.success(result.message)
          router.refresh()
        } else {
          toast.error(result.message)
        }
      } else {
        // Enroll in course
        const result = await enrollInCourse(courseId)
        
        if (result.success) {
          toast.success(result.message)
          router.refresh()
        } else {
          toast.error(result.message)
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }
  
  return (
    <Button 
      className="w-full" 
      onClick={handleEnrollment}
      disabled={isPending}
      variant={isEnrolled ? "outline" : "default"}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEnrolled ? "Unenrolling..." : "Enrolling..."}
        </>
      ) : isEnrolled ? (
        "Unenroll from Course"
      ) : (
        "Enroll in Course"
      )}
    </Button>
  )
} 