export type StudentActivityState = 'active' | 'at-risk' | 'inactive'

export interface StudentActivityMetrics {
  id: string
  name: string
  email: string
  image: string | null
  enrolledAt: Date
  lastActivityAt: Date | null
  activityState: StudentActivityState
  
  // Activity counts (last 7 days)
  lessonsViewedCount: number
  questionsAskedCount: number
  answersGivenCount: number
  votesGivenCount: number
  
  // Progress metrics
  totalLessonsInCourse: number
  lessonsViewedTotal: number
  progressPercentage: number
}

export interface CourseActivitySummary {
  courseId: string
  courseTitle: string
  totalStudents: number
  activeStudents: number
  atRiskStudents: number
  inactiveStudents: number
  newStudentsThisWeek: number
  averageProgressPercentage: number
  studentsNeedingAttention: StudentActivityMetrics[]
}

export interface ActivityCalculationOptions {
  activeDays?: number // default 7
  atRiskDays?: number // default 14
} 