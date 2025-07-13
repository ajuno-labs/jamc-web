import { getAuthUser } from "@/lib/auth"
import { redirect } from "@/i18n/navigation"
import { OnboardingFlow } from "./_components/OnboardingFlow"
import { triggerWelcomeNotification } from "./_actions/onboarding-actions"

export default async function OnboardingPage() {
  const user = await getAuthUser()
  
  if (!user) {
    return redirect("/signin")
  }

  // Check if user already has roles (skip onboarding if they do)
  if (user.roles.length > 0) {
    return redirect("/")
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
