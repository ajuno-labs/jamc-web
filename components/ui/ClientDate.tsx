"use client"

import { useEffect, useState } from "react"
import { format as formatDateFns } from "date-fns"

interface ClientDateProps {
  date: string | Date
  format?: string // date-fns format string
  className?: string
}

export function ClientDate({ date, format = "MMM d, yyyy 'at' HH:mm", className }: ClientDateProps) {
  const [local, setLocal] = useState<string>("")

  useEffect(() => {
    if (!date) {
      setLocal("")
      return
    }
    const d = typeof date === "string" ? new Date(date) : date
    setLocal(formatDateFns(d, format))
  }, [date, format])

  if (!local) return null
  return <span className={className}>{local}</span>
} 
