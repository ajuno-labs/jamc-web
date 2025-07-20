"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import { EmailField, PasswordField } from "@/components/auth-fields";
import { signUpSchema, type SignUpInput } from "@/lib/types/auth";
import { signUpUser } from "../_actions/signup-actions";
import { markJustAuthenticated } from "@/hooks/use-session-refresh";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/components/icons/google";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export function SignUpForm() {
  const t = useTranslations("SignUpPage");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/", redirect: true });
    } catch (error) {
      console.error("Error signing up with Google:", error);
      setError(t("unexpectedError"));
      setIsGoogleLoading(false);
    }
  };

  async function onSubmit(values: SignUpInput) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUpUser(values);

      if (!result.success) {
        setError(result.error || t("unexpectedError"));
        return;
      }

      // If user was automatically signed in, redirect to onboarding with full page refresh
      if (result.autoSignedIn) {
        // Mark that authentication just happened
        markJustAuthenticated();

        // Use window.location.href for a full page refresh to ensure auth state is properly loaded
        window.location.href = "/onboarding";
        return;
      }

      // If auto sign-in failed but account was created, redirect to sign-in
      router.push("/signin?message=Account created successfully. Please sign in.");
    } catch (error) {
      console.error("Failed to sign up:", error);
      setError(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Display form error */}
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
        onClick={handleGoogleSignUp}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
        {t("signUpWithGoogle")}
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

      {/* Name/Email/Password Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Name Field */}
        <div className="space-y-2">
          <div className="relative">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder=" "
                {...form.register("name")}
                className="peer h-11 pl-10"
                aria-invalid={form.formState.errors.name ? "true" : "false"}
                aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <Label
              htmlFor="name"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              {t("fullName")}
            </Label>
          </div>
          {form.formState.errors.name && (
            <p id="name-error" role="alert" className="text-xs text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <EmailField
          register={form.register("email")}
          error={form.formState.errors.email}
          disabled={isLoading || isGoogleLoading}
        />

        {/* Password Field */}
        <PasswordField
          register={form.register("password")}
          error={form.formState.errors.password}
          disabled={isLoading || isGoogleLoading}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("creatingAccount")}
            </>
          ) : (
            t("createAccountButton")
          )}
        </Button>
      </form>
    </div>
  );
}
