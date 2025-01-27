"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { signInWithCredentials } from "@/app/lib/server-actions/auth/signin"
import { signInSchema } from "@/app/lib/validations/auth"
import type { SignInInput } from "@/app/lib/validations/auth"
import { useRouter } from "next/navigation"

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await signInWithCredentials(data.email, data.password)
      if (result?.error) {
        if (result.error === "Invalid email format") {
          setFormError("email", { message: result.error })
        } else if (result.error.includes("Password must be")) {
          setFormError("password", { message: result.error })
        } else {
          setError(result.error)
        }
        return // Don't proceed if there are errors
      }
      
      if (result?.success) {
        router.push("/")
      } else {
        setError("Authentication failed")
      }
    } catch (error) {
      console.error(error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

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
      <div className="space-y-2">
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder=" "
            {...register("email")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <Label
            htmlFor="email"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-slate-50 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Email
          </Label>
        </div>
        {errors.email && (
          <p 
            id="email-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder=" "
            {...register("password")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <Label
            htmlFor="password"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-slate-50 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Password
          </Label>
        </div>
        {errors.password && (
          <p 
            id="password-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </a>
        </div>
      </div>
      <div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700"
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
  )
} 