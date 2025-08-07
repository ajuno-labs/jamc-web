"use client"

import { Link } from "@/i18n/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslations } from "next-intl"

interface UserLinkProps {
  user: {
    id: string
    name: string | null
    image: string | null
    reputation?: number
  }
  showReputation?: boolean
  className?: string
}

export function UserLink({ user, showReputation = true, className = "" }: UserLinkProps) {

  const t = useTranslations("UserLink")

  return (
    <Link 
      href={`/profile/${user.id}`}
      className={`flex items-center space-x-2 hover:opacity-80 transition-opacity ${className}`}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.image || undefined} alt={user.name || undefined} />
        <AvatarFallback className="text-xs">{user.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{user.name}</span>
        {showReputation && user.reputation !== undefined && (
          <span className="text-xs text-muted-foreground">
            {t('reputation', { count: user.reputation })}
          </span>
        )}
      </div>
    </Link>
  )
} 
