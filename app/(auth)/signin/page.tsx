import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SignInForm } from "./_components/signin-form"
import { GraduationCap } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SignInWithGoogle } from "./_components/signin-with-google"
import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function SignInPage() {
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
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <CardDescription>Motto goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <SignInWithGoogle />
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
            <SignInForm />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-xs text-muted-foreground">
              For school-administered accounts, use your institutional email
            </p>
            <p className="text-xs text-muted-foreground">By continuing, you agree to JAMC&apos;s Terms of Service</p>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-medium">
                Sign up
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

