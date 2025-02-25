import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SignUpWithGoogle } from "./_components/signup-with-google"
import { SignUpForm } from "./_components/signup-form"
import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SignUpPage() {
  const session = await auth()
  
  // Redirect if user is already authenticated
  if (session?.user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left side - OAuth */}
      <div className="lg:flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
            <CardDescription>Join our community of learners</CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpWithGoogle />
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
            <SignUpForm />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-xs text-muted-foreground">
              For school-administered accounts, use your institutional email
            </p>
            <p className="text-xs text-muted-foreground">By continuing, you agree to JAMC&apos;s Terms of Service</p>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-medium" asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 