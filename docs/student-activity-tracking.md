# Student Activity Tracking System

## Overview

The Student Activity Tracking System provides comprehensive monitoring of student engagement in courses, helping teachers identify students who need attention and automatically sending targeted notifications to improve retention and engagement.

## Student Activity States

### 1. Active Students 🟢
- **Criteria**: Activity within the last 7 days
- **Activities tracked**:
  - Viewing lessons
  - Asking questions
  - Answering questions
  - Voting on questions/answers
- **Action**: No intervention needed

### 2. At-Risk Students 🟡
- **Criteria**: No activity for 7-14 days, but had recent activity before that
- **Notification**: Daily engagement reminders
- **Message**: Encouraging, supportive tone to help them get back on track

### 3. Inactive Students 🔴
- **Criteria**: No activity for 14+ days
- **Notification**: Weekly re-engagement emails (sent on Mondays)
- **Message**: Stronger re-engagement messaging with clear action steps

## Features

### Teacher Dashboard
- **Real-time Activity Metrics**: View current student engagement levels
- **Activity Insights Card**: Detailed breakdown of student states with visual indicators
- **Manual Notifications**: Send engagement notifications on-demand
- **Daily Summary Preview**: Preview and send daily activity summaries

### Automated Notifications

#### Daily Summary for Teachers
- Sent to course instructors
- Includes:
  - Total student count and new enrollments
  - Active/at-risk/inactive breakdown
  - Average course completion percentage
  - List of students needing attention

#### Student Engagement Notifications
- **At-Risk Students**: Daily notifications with gentle encouragement
- **Inactive Students**: Weekly notifications (Mondays) with stronger re-engagement messaging
- Personalized with student name and course title

## Technical Implementation

### Data Sources
The system tracks activity from multiple sources:
- `LessonView` records (when students mark lessons as viewed)
- `Question` creation (when students ask questions)
- `Answer` creation (when students answer questions)
- `QuestionVote` and `AnswerVote` (when students vote)
- `ActivityLog` entries (comprehensive activity tracking)

### Key Components

#### Server Actions
- `getCourseStudentActivity()`: Calculate comprehensive activity metrics
- `getCourseStudentsList()`: Get simplified student list with activity states
- `sendDailySummaryToTeacher()`: Send daily summary to instructor
- `sendEngagementNotifications()`: Send targeted student notifications

#### UI Components
- `ActivityNotificationCard`: Teacher dashboard widget for activity insights
- `StatsOverview`: Updated to show activity state breakdown
- `StudentsList`: Enhanced to show real activity data and states

#### Types
- `StudentActivityState`: Type-safe activity state enum
- `StudentActivityMetrics`: Comprehensive student activity data
- `CourseActivitySummary`: Course-level activity aggregation

### Database Queries
The system uses efficient Prisma queries with:
- Proper indexing on activity-related fields
- Date-based filtering for performance
- Aggregated counts to minimize data transfer
- Enhanced Prisma client for access control

## Usage

### For Teachers

1. **View Activity Dashboard**
   - Navigate to `/courses/[courseSlug]/teacher`
   - Review the Activity Insights card for current engagement levels
   - Check the Students section for individual student states

2. **Send Manual Notifications**
   - Click "Preview Summary" to see what the daily summary looks like
   - Click "Send Daily Summary" to email yourself the current summary
   - Click "Send Engagement Notifications" to notify at-risk and inactive students

3. **Monitor Student Progress**
   - Use the color-coded badges to quickly identify student states
   - Review the "Students Needing Attention" alert when present
   - Track progress percentages and question activity

### For Students

Students will automatically receive:
- **At-Risk Notifications**: If inactive for 7-14 days
- **Re-engagement Notifications**: If inactive for 14+ days (weekly)

## Configuration

### Activity Thresholds
Default settings (configurable in `ActivityCalculationOptions`):
- Active: 7 days
- At-risk: 14 days
- Inactive: 14+ days

### Notification Schedule
- **Daily summaries**: Can be sent manually or automated via cron job
- **At-risk notifications**: Daily (when students meet criteria)
- **Inactive notifications**: Weekly on Mondays

## Email Integration

Currently uses a mock email service that logs to console. To integrate with a real email service:

1. Update `sendEmailNotification()` in `notification-actions.ts`
2. Add email service credentials to environment variables
3. Install email service SDK (SendGrid, AWS SES, etc.)

Example integration:
```typescript
// For SendGrid
import sgMail from '@sendgrid/mail'

export async function sendEmailNotification(to: string, subject: string, message: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
  
  const msg = {
    to,
    from: process.env.FROM_EMAIL!,
    subject,
    text: message,
  }
  
  try {
    await sgMail.send(msg)
    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}
```

## Future Enhancements

1. **Automated Scheduling**: Set up cron jobs for automatic daily/weekly notifications
2. **Customizable Thresholds**: Allow teachers to configure activity thresholds per course
3. **Advanced Analytics**: Add trend analysis and predictive insights
4. **Student Dashboard**: Show students their own activity metrics
5. **Notification Preferences**: Allow students to customize notification frequency
6. **Integration with LMS**: Connect with external learning management systems
7. **Mobile Notifications**: Add push notifications for mobile apps

## Monitoring and Analytics

The system provides insights into:
- Course engagement trends
- Notification effectiveness
- Student retention patterns
- Teacher intervention success rates

Use these metrics to continuously improve the engagement strategy and identify courses that may need additional support or content updates. 