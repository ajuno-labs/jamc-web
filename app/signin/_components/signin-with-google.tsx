"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function SignInWithGoogle() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => signIn("google", { callbackUrl })}
    >
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
}
