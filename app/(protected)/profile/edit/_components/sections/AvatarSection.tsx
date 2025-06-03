"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, Loader2 } from "lucide-react"
import { uploadAvatar } from "../../_actions/edit-profile-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AvatarSectionProps {
  user: {
    id: string
    name: string | null
    image: string | null
  }
  avatarUrl: string | null
  onAvatarUpdate: (newUrl: string) => void
}

export function AvatarSection({ user, avatarUrl, onAvatarUpdate }: AvatarSectionProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)

    const formData = new FormData()
    formData.append("avatar", file)

    const result = await uploadAvatar(formData)
    
    if (result.success && result.imageUrl) {
      onAvatarUpdate(result.imageUrl)
      toast.success("Avatar updated successfully!")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to upload avatar")
    }

    setIsUploadingAvatar(false)
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Profile Picture
        </CardTitle>
        <CardDescription>
          Click on your avatar to change your profile picture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar 
              className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleAvatarClick}
            >
              <AvatarImage src={avatarUrl || undefined} alt={user.name || "User"} />
              <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
            )}
            
            <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
              <Camera className="h-3 w-3" />
            </div>
          </div>
          
          <div className="flex-1">
            <Button 
              variant="outline" 
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
