"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/icons/google"
import { signInWithGoogle } from "@/app/lib/server-actions/auth/signin"

type FormData = {
  email: string
  password: string
}

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError("")
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // For demo purposes, always show an error
    setError("Invalid email or password. Please try again.")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left side - OAuth */}
      <div className="lg:flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Empowering Vietnam&apos;s Next Generation</p>
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full" disabled={isLoading} onClick={async () => {
              await signInWithGoogle()
            }}>
              <GoogleIcon />
              Sign in with Google
            </Button>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              Sign in with Microsoft
            </Button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden lg:flex items-center justify-center">
        <Separator orientation="vertical" className="h-2/3" />
        <span className="absolute bg-slate-50 px-2 text-sm text-slate-500">or</span>
      </div>

      {/* Right side - Email/Password form */}
      <div className="lg:flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder=" "
                  {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
                />
                <Label
                  htmlFor="email"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-slate-50 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Email
                </Label>
              </div>
              {errors.email && <p className="text-xs text-red-500">Please enter a valid email address</p>}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder=" "
                  {...register("password", { required: true, minLength: 6 })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
                />
                <Label
                  htmlFor="password"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-slate-50 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Password
                </Label>
              </div>
              {errors.password && <p className="text-xs text-red-500">Password must be at least 6 characters long</p>}
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
                disabled={!isValid || isLoading}
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
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <p className="mt-2 text-xs text-gray-500">
            For school-administered accounts, use your institutional email (@jamc.edu.vn)
          </p>
          <p className="mt-2 text-xs text-gray-500">By continuing, you agree to JAMC&apos;s Terms of Service</p>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

