"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { updateProfile } from "../../_actions/edit-profile-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ProfileInfoSectionProps {
  user: {
    name: string | null
    email: string
  }
}

export function ProfileInfoSection({ user }: ProfileInfoSectionProps) {
  const router = useRouter()
  const [name, setName] = useState(user.name || "")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)

    const formData = new FormData()
    formData.append("name", name)

    const result = await updateProfile(formData)
    
    if (result.success) {
      toast.success("Profile updated successfully!")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to update profile")
    }

    setIsUpdatingProfile(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your basic profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your display name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isUpdatingProfile || !name.trim()}
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
