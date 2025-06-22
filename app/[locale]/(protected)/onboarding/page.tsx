import { getAuthUser } from "@/lib/auth/get-user"
import { redirect } from "next/navigation"
import { OnboardingFlow } from "./_components/OnboardingFlow"
import { triggerWelcomeNotification } from "./_actions/onboarding-actions"

export default async function OnboardingPage() {
  const user = await getAuthUser()
  
  if (!user) {
    redirect("/signin")
  }

  // Check if user already has roles (skip onboarding if they do)
  if (user.roles.length > 0) {
    redirect("/")
  }

  // Trigger welcome notification for new users
  try {
    await triggerWelcomeNotification()
  } catch (error) {
    console.error("Failed to trigger welcome notification:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingFlow user={user} />
    </div>
  )
} 