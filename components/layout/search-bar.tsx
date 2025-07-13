"use client"

import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "@/i18n/navigation"
import { useState, useEffect, useRef } from "react"
import { useTranslations } from 'next-intl'

export function SearchBar() {
  const router = useRouter()
  const t = useTranslations('Layout')
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed && !isLoading) {
      setIsLoading(true)
      try {
        await router.push(`/search?q=${encodeURIComponent(trimmed)}`)
        setQuery("")
      } catch (error) {
        console.error("Search navigation error:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md">
      <div className="relative">
        {isLoading ? (
          <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        )}
        <Input
          type="search"
          placeholder={isLoading ? t('searching') : t('search')}
          className="pl-10 w-full"
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
        />
        {(!isFocused || !query) && !isLoading && (
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Ctrl + K
          </kbd>
        )}
      </div>
    </form>
  )
}
