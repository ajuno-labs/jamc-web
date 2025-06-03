"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut } from "next-auth/react"
import { UserNav } from "@/components/layout/user-nav"
import { useSessionRefresh } from "@/hooks/use-session-refresh"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { session } = useSessionRefresh()

  return (
    <header className="sticky flex justify-center top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">JAMC</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-6">
          {session && (
            <>
              <Link href="/questions" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Q&A</Link>
              <Link href="/courses" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Courses</Link>
            </>
          )}
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
          <a href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Testimonials</a>
        </nav>
        
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <UserNav user={session.user} />
          ) : (
            <> 
              <Button variant="outline" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">JAMC</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              
              <nav className="flex flex-col gap-4 py-8">
                {session && (
                  <>
                    <Link
                      href="/questions"
                      className="text-base font-medium py-2 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Q&A
                    </Link>
                    <Link
                      href="/courses"
                      className="text-base font-medium py-2 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Courses
                    </Link>
                  </>
                )}
                <a
                  href="#features"
                  className="text-base font-medium py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-base font-medium py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="text-base font-medium py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Testimonials
                </a>
              </nav>
              
              <div className="mt-auto flex flex-col gap-3 py-6">
                {session ? (
                  <Button variant="ghost" className="w-full" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
} 