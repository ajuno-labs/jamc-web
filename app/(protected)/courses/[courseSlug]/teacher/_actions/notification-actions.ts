"use server"

import { getEnhancedPrisma } from "@/lib/db/enhanced"
import { getCourseStudentActivity } from "./student-activity-actions"

/**
 * Generate a daily summary report for teachers
 */
export async function generateDailySummaryForTeacher(courseSlug: string): Promise<string> {
  const summary = await getCourseStudentActivity(courseSlug)
  
  const report = `
📊 Daily Course Summary: ${summary.courseTitle}

👥 Student Activity:
• Total Students: ${summary.totalStudents}
• Active (7 days): ${summary.activeStudents} (${Math.round((summary.activeStudents / summary.totalStudents) * 100)}%)
• At Risk: ${summary.atRiskStudents} students
• Inactive: ${summary.inactiveStudents} students
• New This Week: ${summary.newStudentsThisWeek}

📈 Progress:
• Average Completion: ${summary.averageProgressPercentage}%

⚠️ Students Needing Attention: ${summary.studentsNeedingAttention.length}
${summary.studentsNeedingAttention.slice(0, 5).map(s => 
  `• ${s.name} (${s.activityState}) - ${s.progressPercentage}% complete`
).join('\n')}
${summary.studentsNeedingAttention.length > 5 ? `... and ${summary.studentsNeedingAttention.length - 5} more` : ''}

Generated on ${new Date().toLocaleDateString()}
  `.trim()
  
  return report
}

/**
 * Get students who need engagement notifications
 */
export async function getStudentsForEngagementNotifications(courseSlug: string) {
  const summary = await getCourseStudentActivity(courseSlug)
  
  // Students who are at-risk (no activity in 7-14 days)
  const atRiskStudents = summary.studentsNeedingAttention.filter(s => s.activityState === 'at-risk')
  
  // Students who are inactive (no activity in 14+ days)
  const inactiveStudents = summary.studentsNeedingAttention.filter(s => s.activityState === 'inactive')
  
  return {
    courseTitle: summary.courseTitle,
    atRiskStudents,
    inactiveStudents
  }
}

/**
 * Generate engagement message for at-risk students
 */
export async function generateAtRiskStudentMessage(studentName: string, courseTitle: string): Promise<string> {
  return `Hi ${studentName}! 👋

We noticed you haven't been active in "${courseTitle}" for a few days. 

Don't fall behind! Here's what you can do:
• Check out the latest lessons
• Ask questions if you're stuck
• Review previous materials

Your learning journey matters to us! 🎓

Best regards,
Your Course Team`
}

/**
 * Generate re-engagement message for inactive students
 */
export async function generateInactiveStudentMessage(studentName: string, courseTitle: string): Promise<string> {
  return `Hello ${studentName},

We miss you in "${courseTitle}"! 😊

It's been a while since your last activity. Here's how to get back on track:
• Review where you left off
• Catch up on new lessons
• Connect with classmates and ask questions
• Set aside some time for regular study

We're here to support your success! 💪

Best regards,
Your Course Team`
}

/**
 * Mock function to send email notification
 * In a real implementation, this would integrate with an email service
 */
export async function sendEmailNotification(
  to: string, 
  subject: string, 
  message: string
): Promise<boolean> {
  // Mock implementation - in production, integrate with SendGrid, AWS SES, etc.
  console.log(`📧 Email Notification:`)
  console.log(`To: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)
  console.log(`---`)
  
  // Simulate async email sending
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return true
}

/**
 * Send daily summary to course instructor
 */
export async function sendDailySummaryToTeacher(courseSlug: string): Promise<boolean> {
  try {
    const db = await getEnhancedPrisma()
    
    // Get course and instructor info
    const course = await db.course.findUnique({
      where: { slug: courseSlug },
      include: {
        author: { select: { email: true, name: true } }
      }
    })
    
    if (!course) {
      throw new Error('Course not found')
    }
    
    const summary = await generateDailySummaryForTeacher(courseSlug)
    
    return await sendEmailNotification(
      course.author.email,
      `Daily Summary: ${course.title}`,
      summary
    )
  } catch (error) {
    console.error('Failed to send daily summary:', error)
    return false
  }
}

/**
 * Send engagement notifications to students
 */
export async function sendEngagementNotifications(courseSlug: string): Promise<{
  atRiskSent: number
  inactiveSent: number
  errors: string[]
}> {
  try {
    const { courseTitle, atRiskStudents, inactiveStudents } = await getStudentsForEngagementNotifications(courseSlug)
    
    let atRiskSent = 0
    let inactiveSent = 0
    const errors: string[] = []
    
    // Send notifications to at-risk students
    for (const student of atRiskStudents) {
      try {
        const message = await generateAtRiskStudentMessage(student.name, courseTitle)
        const success = await sendEmailNotification(
          student.email,
          `Don't fall behind in ${courseTitle}!`,
          message
        )
        if (success) atRiskSent++
      } catch (error) {
        errors.push(`Failed to notify ${student.name}: ${error}`)
      }
    }
    
    // Send notifications to inactive students (weekly, not daily)
    const today = new Date()
    const isWeeklyNotificationDay = today.getDay() === 1 // Monday
    
    if (isWeeklyNotificationDay) {
      for (const student of inactiveStudents) {
        try {
          const message = await generateInactiveStudentMessage(student.name, courseTitle)
          const success = await sendEmailNotification(
            student.email,
            `We miss you in ${courseTitle}!`,
            message
          )
          if (success) inactiveSent++
        } catch (error) {
          errors.push(`Failed to notify ${student.name}: ${error}`)
        }
      }
    }
    
    return { atRiskSent, inactiveSent, errors }
  } catch (error) {
    console.error('Failed to send engagement notifications:', error)
    return { atRiskSent: 0, inactiveSent: 0, errors: [String(error)] }
  }
} 