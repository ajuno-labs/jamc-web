"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "./mode-toggle"
import { UserNav } from "./user-nav"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationBell } from "@/components/notifications/NotificationBell"

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-between h-14 items-center gap-4 px-6">
          {/* Sidebar Trigger */}
          <SidebarTrigger />
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {user && <NotificationBell />}
            <ModeToggle />
            <UserNav user={user} />
          </div>
        </div>
    </header>
  )
} 