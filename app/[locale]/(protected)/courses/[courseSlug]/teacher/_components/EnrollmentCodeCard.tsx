'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

interface EnrollmentCodeCardProps {
  joinCode: string | null
}

export function EnrollmentCodeCard({ joinCode }: EnrollmentCodeCardProps) {
  const [copied, setCopied] = React.useState(false)
  const code = joinCode || 'Not generated'

  const handleCopy = async () => {
    if (!joinCode) return
    await navigator.clipboard.writeText(joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Code</CardTitle>
          <CardDescription>Share this code with students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{code}</span>
            {joinCode && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleCopy}
                aria-label="Copy enrollment code"
              >
                {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 