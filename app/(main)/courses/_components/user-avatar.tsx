import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  name: string
  image?: string | null
  className?: string
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  // Get initials from name (first letter of first and last name)
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Avatar className={className}>
      <AvatarImage src={image || ""} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
} 