"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { UserNav } from "./user-nav"

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
      <div className="container mx-auto">
        <div className="flex h-14 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl">JAMC</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/questions"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Q&A
              </Link>
              <Link
                href="/courses"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Courses
              </Link>
              <Link
                href="/community"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Community
              </Link>
            </nav>
          </div>

          {/* User Navigation */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </header>
  )
} 