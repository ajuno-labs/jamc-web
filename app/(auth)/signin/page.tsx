import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SignInForm } from "./_components/signin-form"
import { GraduationCap } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SignInWithGoogle } from "./_components/signin-with-google"

export default async function SignInPage() {
  const session = await auth()
  
  // Redirect if user is already authenticated
  if (session?.user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left side - OAuth */}
      <div className="lg:flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Motto goes here</p>
          </div>
          <div className="space-y-4">
            <SignInWithGoogle />
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
          <SignInForm />
          <p className="mt-2 text-xs text-gray-500">
            For school-administered accounts, use your institutional email
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

