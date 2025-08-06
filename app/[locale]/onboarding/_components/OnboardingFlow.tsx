"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { WelcomeStep } from "./WelcomeStep";
import { RoleSelectionStep } from "./RoleSelectionStep";
import { TeacherNextSteps } from "./TeacherNextSteps";
import { StudentNextSteps } from "./StudentNextSteps";
import { type UserWithRoles } from "@/lib/types/prisma";
import { handleRoleSelect as handleRoleSelectAction } from "../actions/onboarding-actions";
import { Role } from "@/lib/types/roles";

type OnboardingStep = "welcome" | "role-selection" | "next-steps";

interface OnboardingFlowProps {
  user: UserWithRoles;
}

export function OnboardingFlow({ user }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSkipping, setIsSkipping] = useState(false);

  const handleWelcomeNext = () => {
    setCurrentStep("role-selection");
  };

  const handleSkipOnboarding = async () => {
    setIsSkipping(true);
    try {
      await handleRoleSelectAction(Role.STUDENT);
    } catch (error) {
      console.error("Error assigning student role during skip:", error);
    }

    await router.push("/");
    router.refresh();
  };

  const handleCompleteOnboarding = async () => {
    await router.push("/dashboard");
    router.refresh();
  };

  const handleRoleSelect = async (role: Role) => {
    try {
      await handleRoleSelectAction(role);
      setSelectedRole(role);
      setCurrentStep("next-steps");
    } catch (error) {
      console.error("Error selecting role:", error);
    }
  };

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
            isSkipping={isSkipping}
          />
        )}

        {currentStep === "next-steps" && selectedRole === Role.TEACHER && (
          <TeacherNextSteps
            user={user}
            onComplete={handleCompleteOnboarding}
            onSkip={handleCompleteOnboarding}
          />
        )}

        {currentStep === "next-steps" && selectedRole === Role.STUDENT && (
          <StudentNextSteps
            user={user}
            onComplete={handleCompleteOnboarding}
            onSkip={handleCompleteOnboarding}
          />
        )}
      </div>
    </div>
  );
}
