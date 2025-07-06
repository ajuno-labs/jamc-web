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

/**
 * Renders the main application header with navigation controls, search bar, and user-related actions.
 *
 * Displays a sidebar trigger, search bar, and a group of controls including notifications, mode toggle, language switcher, and user navigation. The notification bell is shown only if a user is provided.
 *
 * @param user - Optional user information for displaying personalized navigation and notifications
 */
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
