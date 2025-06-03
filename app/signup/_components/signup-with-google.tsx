"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/icons/google"

export function SignUpWithGoogle() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { callbackUrl: "/" })
    } catch (error) {
      console.error("Error signing in with Google:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-4">
      <Button 
        variant="outline" 
        type="button" 
        disabled={isLoading}
        onClick={handleSignIn}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Sign up with Google
      </Button>
    </div>
  )
} 