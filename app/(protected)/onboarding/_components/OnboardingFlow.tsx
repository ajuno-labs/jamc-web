"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { WelcomeStep } from "./WelcomeStep"
import { RoleSelectionStep } from "./RoleSelectionStep"
import { TeacherNextSteps } from "./TeacherNextSteps"
import { StudentNextSteps } from "./StudentNextSteps"
import { type UserWithRoles } from "@/lib/types/prisma"

type OnboardingStep = "welcome" | "role-selection" | "next-steps"
type UserRole = "teacher" | "student"

interface OnboardingFlowProps {
  user: UserWithRoles
}

export function OnboardingFlow({ user }: OnboardingFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const handleWelcomeNext = () => {
    setCurrentStep("role-selection")
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setCurrentStep("next-steps")
  }

  const handleSkipOnboarding = () => {
    // Redirect to main app without setting a role
    router.push("/")
  }

  const handleCompleteOnboarding = () => {
    // Redirect to main app after completing onboarding
    router.push("/")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        {currentStep === "welcome" && (
          <WelcomeStep
            user={user}
            onNext={handleWelcomeNext}
            onSkip={handleSkipOnboarding}
          />
        )}
        
        {currentStep === "role-selection" && (
          <RoleSelectionStep
            onRoleSelect={handleRoleSelect}
            onSkip={handleSkipOnboarding}
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