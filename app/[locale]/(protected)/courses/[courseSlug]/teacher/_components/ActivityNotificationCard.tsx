'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bell, Mail, AlertTriangle, Users } from 'lucide-react'
import type { CourseActivitySummary } from '@/lib/types/student-activity'
import { 
  sendDailySummaryToTeacher, 
  sendEngagementNotifications,
  generateDailySummaryForTeacher 
} from '../_actions/notification-actions'

interface ActivityNotificationCardProps {
  courseSlug: string
  activitySummary: CourseActivitySummary
}

export function ActivityNotificationCard({ courseSlug, activitySummary }: ActivityNotificationCardProps) {
  const [loading, setLoading] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [summaryPreview, setSummaryPreview] = useState<string>('')

  const handleSendDailySummary = async () => {
    setLoading(true)
    try {
      const success = await sendDailySummaryToTeacher(courseSlug)
      setLastAction(success ? 'Daily summary sent successfully!' : 'Failed to send daily summary')
    } catch {
      setLastAction('Error sending daily summary')
    } finally {
      setLoading(false)
    }
  }

  const handleSendEngagementNotifications = async () => {
    setLoading(true)
    try {
      const result = await sendEngagementNotifications(courseSlug)
      setLastAction(
        `Sent ${result.atRiskSent} at-risk notifications and ${result.inactiveSent} inactive notifications. ${result.errors.length > 0 ? `${result.errors.length} errors.` : ''}`
      )
    } catch {
      setLastAction('Error sending engagement notifications')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewSummary = async () => {
    setLoading(true)
    try {
      const preview = await generateDailySummaryForTeacher(courseSlug)
      setSummaryPreview(preview)
      setShowPreview(true)
    } catch {
      setLastAction('Error generating preview')
    } finally {
      setLoading(false)
    }
  }

  const studentsNeedingAttention = activitySummary.atRiskStudents + activitySummary.inactiveStudents

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Student Activity Insights
        </CardTitle>
        <CardDescription>
          Monitor student engagement and send targeted notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Activity Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{activitySummary.activeStudents}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{activitySummary.atRiskStudents}</div>
            <div className="text-xs text-muted-foreground">At Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{activitySummary.inactiveStudents}</div>
            <div className="text-xs text-muted-foreground">Inactive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{activitySummary.averageProgressPercentage}%</div>
            <div className="text-xs text-muted-foreground">Avg Progress</div>
          </div>
        </div>

        {/* Alerts */}
        {studentsNeedingAttention > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{studentsNeedingAttention} students</strong> need attention. 
              Consider sending engagement notifications to help them get back on track.
            </AlertDescription>
          </Alert>
        )}

        {/* Activity State Definitions */}
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="font-medium">Activity States:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div>
              <Badge className="bg-green-500 mr-1">Active</Badge>
              Activity within 7 days
            </div>
            <div>
              <Badge variant="destructive" className="mr-1">At Risk</Badge>
              No activity for 7-14 days
            </div>
            <div>
              <Badge variant="outline" className="mr-1">Inactive</Badge>
              No activity for 14+ days
            </div>
          </div>
        </div>

        {/* Summary Preview */}
        {showPreview && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Daily Summary Preview:</div>
            <div className="bg-muted p-3 rounded text-xs whitespace-pre-line max-h-40 overflow-y-auto">
              {summaryPreview}
            </div>
          </div>
        )}

        {/* Last Action Result */}
        {lastAction && (
          <Alert>
            <AlertDescription>{lastAction}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePreviewSummary}
          disabled={loading}
        >
          <Mail className="h-4 w-4 mr-1" />
          Preview Summary
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSendDailySummary}
          disabled={loading}
        >
          <Mail className="h-4 w-4 mr-1" />
          Send Daily Summary
        </Button>
        <Button 
          size="sm" 
          onClick={handleSendEngagementNotifications}
          disabled={loading || studentsNeedingAttention === 0}
        >
          <Users className="h-4 w-4 mr-1" />
          Send Engagement Notifications
        </Button>
      </CardFooter>
    </Card>
  )
} 