"use client"

import { useState } from "react"
import { AvatarSection } from "./sections/AvatarSection"
import { RoleSection } from "./sections/RoleSection"
import { ProfileInfoSection } from "./sections/ProfileInfoSection"

interface User {
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

interface ProfileEditFormProps {
  user: User
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.image)

  const handleAvatarUpdate = (newUrl: string) => {
    setAvatarUrl(newUrl)
  }

  return (
    <div className="space-y-6">
      <AvatarSection 
        user={user}
        avatarUrl={avatarUrl}
        onAvatarUpdate={handleAvatarUpdate}
      />
      
      <RoleSection user={user} />
      
      <ProfileInfoSection user={user} />
    </div>
  )
} 