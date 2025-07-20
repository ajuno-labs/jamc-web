"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { signInSchema } from "@/lib/types/auth";
import { z } from "zod";
import { EmailField, PasswordField } from "@/components/auth-fields";
import { markJustAuthenticated } from "@/hooks/use-session-refresh";
import { useTranslations } from "next-intl";
import { GoogleIcon } from "@/components/icons/google";
import { Separator } from "@/components/ui/separator";

export type SignInInput = z.infer<typeof signInSchema>;

export function SignInForm() {
  const t = useTranslations("SignInPage");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { update } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl, redirect: true });
    } catch (error) {
      console.error("Google auth error:", error);
      setError(t("unexpectedError"));
      setIsGoogleLoading(false);
    }
  };

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        const errorCode = result.error;
        let message = errorCode;
        if (errorCode === "CredentialsSignin" || errorCode === "Configuration") {
          message = t("invalidCredentials");
        }
        setError(message);
      } else if (result?.url) {
        markJustAuthenticated();
        await update();
        window.location.href = result.url;
      }
    } catch (error) {
      console.error(error);
      setError(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md"
        >
          {error}
        </div>
      )}

      {/* Google OAuth Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleAuth}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
        {t("continueWithGoogle")}
      </Button>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">{t("or")}</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <EmailField
          register={register("email")}
          error={errors.email}
          disabled={isLoading || isGoogleLoading}
        />

        <PasswordField
          register={register("password")}
          error={errors.password}
          disabled={isLoading || isGoogleLoading}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:underline">
              {t("forgotPassword")}
            </a>
          </div>
        </div>
        <div>
          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("signingIn")}
              </>
            ) : (
              t("signIn")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
