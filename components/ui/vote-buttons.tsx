"use client"

import { useTransition } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface VoteButtonsProps {
  itemId: string
  upvotes: number
  downvotes: number
  userVote?: number | null
  onVote: (itemId: string, value: 1 | -1) => Promise<void>
  orientation?: "vertical" | "horizontal"
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  className?: string
}

export function VoteButtons({
  itemId,
  upvotes,
  downvotes,
  userVote = null,
  onVote,
  orientation = "horizontal",
  size = "sm",
  showCount = true,
  className,
}: VoteButtonsProps) {
  const [isPending, startTransition] = useTransition()

  const totalVotes = upvotes - downvotes

  const handleVote = (value: 1 | -1) => {
    startTransition(async () => {
      try {
        await onVote(itemId, value)
      } catch (error) {
        toast.error("You must be logged in to vote")
      }
    })
  }

  const sizeClasses = {
    sm: "h-8 px-2",
    md: "h-9 px-3",
    lg: "h-10 px-4",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-1", 
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote(1)}
        disabled={isPending}
        className={cn(
          sizeClasses[size],
          userVote === 1 && "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        )}
        aria-label="Upvote"
      >
        <ChevronUp className={cn(iconSizes[size])} />
      </Button>
      
      {showCount && (
        <span className={cn(
          "font-medium", 
          totalVotes > 0 ? "text-green-600 dark:text-green-400" : 
          totalVotes < 0 ? "text-red-600 dark:text-red-400" : 
          "text-muted-foreground"
        )}>
          {totalVotes}
        </span>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote(-1)}
        disabled={isPending}
        className={cn(
          sizeClasses[size],
          userVote === -1 && "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
        )}
        aria-label="Downvote"
      >
        <ChevronDown className={cn(iconSizes[size])} />
      </Button>
    </div>
  )
} 