"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { WelcomeStep } from "./WelcomeStep"
import { RoleSelectionStep } from "./RoleSelectionStep"
import { TeacherNextSteps } from "./TeacherNextSteps"
import { StudentNextSteps } from "./StudentNextSteps"
import { type UserWithRoles } from "@/lib/types/prisma"
import { assignUserRole } from "../_actions/onboarding-actions"

type OnboardingStep = "welcome" | "role-selection" | "next-steps"
type UserRole = "teacher" | "student"

interface OnboardingFlowProps {
  user: UserWithRoles
}

export function OnboardingFlow({ user }: OnboardingFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isSkipping, setIsSkipping] = useState(false)

  const handleWelcomeNext = () => {
    setCurrentStep("role-selection")
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setCurrentStep("next-steps")
  }

  const handleSkipOnboarding = async () => {
    setIsSkipping(true)
    try {
      // Assign student role when user skips onboarding
      await assignUserRole("student")
    } catch (error) {
      console.error("Error assigning student role during skip:", error)
    }
    // Redirect to main app and refresh to update user state
    await router.push("/")
    router.refresh()
  }

  const handleCompleteOnboarding = async () => {
    // Redirect to main app and refresh to update user state
    await router.push("/")
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        {currentStep === "welcome" && (
          <WelcomeStep
            user={user}
            onNext={handleWelcomeNext}
            onSkip={handleSkipOnboarding}
            isSkipping={isSkipping}
          />
        )}
        
        {currentStep === "role-selection" && (
          <RoleSelectionStep
            onRoleSelect={handleRoleSelect}
            onSkip={handleSkipOnboarding}
            isSkipping={isSkipping}
          />
        )}
        
        {currentStep === "next-steps" && selectedRole === "teacher" && (
          <TeacherNextSteps
            user={user}
            onComplete={handleCompleteOnboarding}
            onSkip={handleCompleteOnboarding}
          />
        )}
        
        {currentStep === "next-steps" && selectedRole === "student" && (
          <StudentNextSteps
            user={user}
            onComplete={handleCompleteOnboarding}
            onSkip={handleCompleteOnboarding}
          />
        )}
      </div>
    </div>
  )
}