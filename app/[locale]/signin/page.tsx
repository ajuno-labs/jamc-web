import { SignInForm } from "./_components/signin-form"
import { GraduationCap} from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { SignInWithGoogle } from "./_components/signin-with-google"
import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { SignupSuccessMessage } from "./_components/signup-success-message"

function SignInFormFallback() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-11 bg-gray-200 rounded-md"></div>
        <div className="h-11 bg-gray-200 rounded-md"></div>
        <div className="h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  )
}

function GoogleSignInFallback() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded-md w-full"></div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left side - OAuth */}
      <div className="lg:flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <CardDescription>Work hard, play hard</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<GoogleSignInFallback />}>
              <SignInWithGoogle />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Divider */}
      <div className="hidden lg:flex items-center justify-center">
        <Separator orientation="vertical" className="h-2/3" />
        <span className="absolute bg-background px-2 text-sm text-muted-foreground">or</span>
      </div>

      {/* Right side - Email/Password form */}
      <div className="lg:flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Suspense fallback={<div />}>
              <SignupSuccessMessage />
            </Suspense>
            <Suspense fallback={<SignInFormFallback />}>
              <SignInForm />
            </Suspense>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-xs text-muted-foreground">
              For school-administered accounts, use your institutional email
            </p>
            <p className="text-xs text-muted-foreground">By continuing, you agree to JAMC&apos;s Terms of Service</p>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account? 
              <Button variant="link" className="px-2 h-auto font-medium" asChild>
                <Link href="/signup"> Sign up </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}