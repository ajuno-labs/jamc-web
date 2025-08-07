import { Link } from "@/i18n/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserX } from "lucide-react"

interface PseudonymousUserDisplayProps {
  user: {
    id: string
    name: string | null
    image: string | null
    reputation?: number
  }
  pseudonymousName?: {
    id: string
    name: string
  } | null
  showReputation?: boolean
  className?: string
}

export function PseudonymousUserDisplay({ 
  user, 
  pseudonymousName, 
  showReputation = true, 
  className = "" 
}: PseudonymousUserDisplayProps) {
  if (pseudonymousName) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="text-xs bg-muted">
            <UserX className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-muted-foreground">
            {pseudonymousName.name}
          </span>
          <span className="text-xs text-muted-foreground">
            Anonymous Student
          </span>
        </div>
      </div>
    )
  }

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
            {user.reputation} reputation
          </span>
        )}
      </div>
    </Link>
  )
}
