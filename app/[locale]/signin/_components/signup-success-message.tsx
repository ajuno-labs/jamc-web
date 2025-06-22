"use client"

import { useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"

export function SignupSuccessMessage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  if (!message) return null

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center space-x-3">
      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      <p className="text-sm text-green-700">{message}</p>
    </div>
  )
} 