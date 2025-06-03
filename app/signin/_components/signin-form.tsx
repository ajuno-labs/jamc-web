"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInSchema } from "@/lib/types/auth";
import { z } from "zod";
import { EmailField, PasswordField } from "@/components/auth-fields";

export type SignInInput = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
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
          message = "Invalid email or password";
        }
        setError(message);
      } else if (result?.url) {
        router.push(result.url);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred");
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
            Forgot your password?
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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </div>
    </form>
  );
}
