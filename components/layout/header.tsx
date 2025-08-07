"use client"

import { ModeToggle } from "./mode-toggle"
import { UserNav } from "./user-nav"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationBell } from "@/components/notifications/NotificationBell"
import { LanguageSwitcher } from "@/components/language-switcher"
import { SearchBar } from "./search-bar"

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function Header({ user }: HeaderProps) {

  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between h-14 items-center px-2 sm:px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <SearchBar />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {user && <NotificationBell />}
          <ModeToggle />
          <div className="hidden xs:block">
            <LanguageSwitcher />
          </div>
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
