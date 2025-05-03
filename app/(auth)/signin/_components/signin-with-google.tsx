"use client"

import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/icons/google"
import { signInWithGoogle } from "../_actions/signin"

export function SignInWithGoogle() {
  return (
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={() => signInWithGoogle()}
    >
      <GoogleIcon />
      Sign in with Google
    </Button>
  )
} 