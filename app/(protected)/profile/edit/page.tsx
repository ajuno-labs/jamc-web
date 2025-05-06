import { redirect } from "next/navigation"
import Link from "next/link"
import { getUserProfile } from "../_actions/profile-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "./_components/profile-form"

export default async function EditProfilePage() {
  const profileData = await getUserProfile()
  
  // If no user is found, redirect to login
  if (!profileData) {
    redirect("/signin")
  }
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">&larr; Back to Profile</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        
        <CardContent>
          <ProfileForm user={profileData.user} />
        </CardContent>
        
        <CardFooter className="flex-col space-y-2 items-start sm:flex-row sm:space-y-0 sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Some information may be visible to other users
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 