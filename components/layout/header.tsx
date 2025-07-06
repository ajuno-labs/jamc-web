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
      <div className="flex justify-between h-14 items-center px-4">
        <SidebarTrigger />
        <SearchBar />
        <div className="flex items-center gap-2">
          {user && <NotificationBell />}
          <ModeToggle />
          <LanguageSwitcher />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
