"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function SignInWithGoogle() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl, redirect: true });
  };
  
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignIn}
    >
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
}
