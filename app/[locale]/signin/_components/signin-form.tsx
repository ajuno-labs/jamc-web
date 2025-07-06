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
import { useTranslations } from 'next-intl';

export type SignInInput = z.infer<typeof signInSchema>;

/**
 * Renders a localized sign-in form with email and password fields, handling user authentication and error display.
 *
 * Validates input using Zod and React Hook Form, manages loading and error states, and redirects on successful authentication. All user-facing text and error messages are internationalized.
 */
export function SignInForm() {
  const t = useTranslations('SignInPage');
  const [isLoading, setIsLoading] = useState(false);
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
        if (
          errorCode === "CredentialsSignin" ||
          errorCode === "Configuration"
        ) {
          message = t('invalidCredentials');
        }
        setError(message);
      } else if (result?.url) {
        markJustAuthenticated();
        
        await update();
        
        window.location.href = result.url;
      }
    } catch (error) {
      console.error(error);
      setError(t('unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md"
        >
          {error}
        </div>
      )}
      
      <EmailField
        register={register("email")}
        error={errors.email}
        disabled={isLoading}
      />
      
      <PasswordField
        register={register("password")}
        error={errors.password}
        disabled={isLoading}
      />
      
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {t('forgotPassword')}
          </a>
        </div>
      </div>
      <div>
        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('signingIn')}
            </>
          ) : (
            t('signIn')
          )}
        </Button>
      </div>
    </form>
  );
}
