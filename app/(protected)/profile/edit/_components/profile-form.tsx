"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { updateUserProfile, ProfileUpdateData } from "../../_actions/update-profile"
import { toast } from "sonner"

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional().nullable(),
  email: z.string().email({ message: "Please enter a valid email" }),
  image: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    createdAt: Date
    roles: Array<{
      name: string
      permissions: string[]
    }>
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      image: user.image,
    },
  })
  
  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await updateUserProfile(values as ProfileUpdateData)
      
      if (result.success) {
        toast.success("Profile updated successfully")
        router.push("/profile")
      } else {
        setError(result.error || "Failed to update profile")
        
        // Set field errors if available
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors && errors.length > 0) {
              form.setError(field as keyof ProfileFormValues, { 
                type: "manual", 
                message: errors[0] 
              })
            }
          })
        }
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Display form error */}
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {/* Profile Picture */}
      <div className="space-y-4">
        <Label>Profile Picture</Label>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || undefined} alt={user.name || undefined} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <Button type="button" variant="outline" disabled>
            Change Avatar
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Avatar functionality coming soon. Currently using image from OAuth provider.
        </p>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...form.register("name")}
          aria-invalid={!!form.formState.errors.name}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>
      
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          aria-invalid={!!form.formState.errors.email}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      {/* Password Change Link */}
      <div className="pt-2">
        <Button type="button" variant="outline" asChild>
          <Link href="/profile/change-password">Change Password</Link>
        </Button>
      </div>
      
      {/* Submit Button */}
      <div className="pt-4 flex space-x-4">
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push("/profile")}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
} 