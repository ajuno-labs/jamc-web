import { getAuthUser } from "@/lib/auth/get-user"
import { redirect } from "next/navigation"
import { OnboardingFlow } from "./_components/OnboardingFlow"

export default async function OnboardingPage() {
  const user = await getAuthUser()
  
  if (!user) {
    redirect("/signin")
  }

  // Check if user already has roles (skip onboarding if they do)
  if (user.roles.length > 0) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingFlow user={user} />
    </div>
  )
} 