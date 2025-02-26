"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import { UserNav } from "./user-nav"
import { cn } from "@/lib/utils"

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  const links = [
    {
      href: "/questions",
      label: "Q&A",
    },
    {
      href: "/courses",
      label: "Courses",
    },
  ]

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
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    isActive(href)
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {label}
                </Link>
              ))}
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