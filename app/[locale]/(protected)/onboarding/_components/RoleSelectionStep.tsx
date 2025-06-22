"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, BookOpen, ChevronRight } from "lucide-react"
import { assignUserRole } from "../_actions/onboarding-actions"

interface RoleSelectionStepProps {
  onRoleSelect: (role: "teacher" | "student") => void
  onSkip: () => void
  isSkipping?: boolean
}

export function RoleSelectionStep({ onRoleSelect, onSkip, isSkipping = false }: RoleSelectionStepProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleRoleSelect = async (role: "teacher" | "student") => {
    setIsLoading(role)
    
    try {
      const result = await assignUserRole(role)
      
      if (result.success) {
        onRoleSelect(role)
      } else {
        console.error("Failed to assign role:", result.error)
        // Still proceed to next step even if role assignment fails
        onRoleSelect(role)
      }
    } catch (error) {
      console.error("Error assigning role:", error)
      // Still proceed to next step
      onRoleSelect(role)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Choose Your Role</CardTitle>
        <p className="text-muted-foreground">
          How would you like to use JAMC? You can always change this later.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Student Option */}
          <Card 
            className="cursor-pointer border-2 transition-all hover:border-primary hover:shadow-md"
            onClick={() => !isLoading && !isSkipping && handleRoleSelect("student")}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <BookOpen className="h-12 w-12 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Student</h3>
                <p className="text-sm text-muted-foreground">
                  Join courses, participate in Q&A, and track your learning progress
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={isLoading !== null || isSkipping}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRoleSelect("student")
                }}
              >
                {isLoading === "student" ? (
                  "Setting up..."
                ) : (
                  <>
                    I&apos;m a Student
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Teacher Option */}
          <Card 
            className="cursor-pointer border-2 transition-all hover:border-primary hover:shadow-md"
            onClick={() => !isLoading && !isSkipping && handleRoleSelect("teacher")}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <GraduationCap className="h-12 w-12 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Teacher</h3>
                <p className="text-sm text-muted-foreground">
                  Create courses, manage students, and engage with your classroom
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={isLoading !== null || isSkipping}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRoleSelect("teacher")
                }}
              >
                {isLoading === "teacher" ? (
                  "Setting up..."
                ) : (
                  <>
                    I&apos;m a Teacher
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center pt-4">
          <Button variant="ghost" onClick={onSkip} disabled={isLoading !== null || isSkipping}>
            {isSkipping ? "Setting up..." : "I'll decide later"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 