import { getAuthUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      return NextResponse.json({ needsOnboarding: false }, { status: 401 })
    }
    
    // Check if user has any roles assigned
    const needsOnboarding = user.roles.length === 0
    
    return NextResponse.json({ needsOnboarding })
  } catch (error) {
    console.error("Error checking onboarding status:", error)
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    )
  }
} 
