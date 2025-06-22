"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { debugTestNotifications } from "../_actions/debug-actions"

interface DebugNotificationActionsProps {
  userId: string
}

export function DebugNotificationActions({ userId }: DebugNotificationActionsProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [questionId, setQuestionId] = useState("")
  const [answerId, setAnswerId] = useState("")

  const handleTestWelcome = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      const result = await debugTestNotifications('welcome', userId)
      setMessage(result.success ? result.message || "Success" : result.error || "Unknown error")
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTestNewAnswer = async () => {
    if (!questionId || !answerId) {
      setMessage("Please provide both Question ID and Answer ID")
      return
    }

    setLoading(true)
    setMessage(null)
    
    try {
      const result = await debugTestNotifications('newAnswer', userId, { questionId, answerId })
      setMessage(result.success ? result.message || "Success" : result.error || "Unknown error")
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTestGeneral = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      const result = await debugTestNotifications('test', userId)
      setMessage(result.success ? result.message || "Success" : result.error || "Unknown error")
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Welcome Notification</CardTitle>
          <CardDescription>Test the welcome notification that should be sent to new users</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleTestWelcome} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Welcome Notification
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test New Answer Notification</CardTitle>
          <CardDescription>Test notification when a question receives an answer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="questionId">Question ID</Label>
              <Input
                id="questionId"
                value={questionId}
                onChange={(e) => setQuestionId(e.target.value)}
                placeholder="Enter question ID"
              />
            </div>
            <div>
              <Label htmlFor="answerId">Answer ID</Label>
              <Input
                id="answerId"
                value={answerId}
                onChange={(e) => setAnswerId(e.target.value)}
                placeholder="Enter answer ID"
              />
            </div>
          </div>
          <Button onClick={handleTestNewAnswer} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send New Answer Notification
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test General Notification</CardTitle>
          <CardDescription>Test basic notification creation</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleTestGeneral} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Test Notification
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>User ID: {userId}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use this page to test notification functionality. Check the notification bell in the header 
            and your profile page after triggering notifications.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 