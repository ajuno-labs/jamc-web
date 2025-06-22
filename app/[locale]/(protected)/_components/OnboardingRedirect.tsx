"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useSession } from "next-auth/react"

export function OnboardingRedirect() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    // Only check for onboarding redirect if user is authenticated
    if (status === "loading") return
    if (!session?.user) return
    
    // Don't redirect if already on onboarding page
    if (pathname.startsWith("/onboarding")) return
    
    // Check if user needs onboarding by calling an API endpoint
    // that checks if they have roles assigned
    const checkOnboardingNeeded = async () => {
      try {
        const response = await fetch("/api/user/check-onboarding")
        const data = await response.json()
        
        if (data.needsOnboarding) {
          router.push("/onboarding")
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error)
      }
    }
    
    checkOnboardingNeeded()
  }, [session, status, pathname, router])

  return null
} 