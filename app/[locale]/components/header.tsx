"use client"

import { Link } from "@/i18n/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserNav } from "@/components/layout/user-nav"
import { useSessionRefresh } from "@/hooks/use-session-refresh"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from 'next-intl'

/**
 * Renders a responsive, localized navigation header with user session awareness and language switching.
 *
 * Displays navigation links, authentication buttons, and user-specific options based on session state. Adapts layout for desktop and mobile screens, providing a slide-in menu on mobile devices.
 */
export function Header() {
  const t = useTranslations('LandingPage.header');
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
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{t('features')}</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{t('howItWorks')}</a>
        </nav>
        
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          {session ? (
            <UserNav user={session.user} />
          ) : (
            <> 
              <Button variant="outline" asChild>
                <Link href="/signin">{t('signIn')}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{t('signUp')}</Link>
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
                <a
                  href="#features"
                  className="text-base font-medium py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t('features')}
                </a>
                <a
                  href="#how-it-works"
                  className="text-base font-medium py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t('howItWorks')}
                </a>
              </nav>
              
              <div className="mt-auto flex flex-col gap-3 py-6">
                <div className="mb-3">
                  <LanguageSwitcher />
                </div>
                {session ? (
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/questions">{t('qa')}</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/courses">{t('courses')}</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/signin">{t('signIn')}</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/signup">{t('signUp')}</Link>
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