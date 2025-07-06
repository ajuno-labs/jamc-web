"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from 'next-intl';

/**
 * Renders a button that initiates Google sign-in using NextAuth, with support for internationalized button text and optional callback URL redirection.
 */
export function SignInWithGoogle() {
  const t = useTranslations('SignInPage');
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
      {t('signInWithGoogle')}
    </Button>
  );
}
