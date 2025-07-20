import { Suspense } from "react";
import { UserWithStats } from "@/lib/utils/user";
import {
  StudentHeader,
  StatsCards,
  ActiveCourses,
  RecentQuestions,
  Suggestions,
  Notifications,
  QuickActions,
  UpcomingDeadlines,
  StatsSkeleton,
  CardSkeleton,
} from "./components";
import {
  getStudentStats,
  getEnrolledCourses,
  getRecentQuestions,
  getRecentNotifications,
  getSuggestions,
  getUpcomingDeadlines,
} from "@/lib/actions/dashboard-actions";

interface StudentDashboardProps {
  user: UserWithStats;
}

async function DashboardStats() {
  const stats = await getStudentStats();

  return (
    <StatsCards
      questionsAsked={stats.questionsAsked}
      answersReceived={stats.answersReceived}
      badges={stats.badges}
      studyStreak={stats.studyStreak}
    />
  );
}

async function DashboardCourses() {
  const courses = await getEnrolledCourses();
  return <ActiveCourses courses={courses} />;
}

async function DashboardQuestions() {
  const questions = await getRecentQuestions();
  return <RecentQuestions questions={questions} />;
}

async function DashboardSuggestions() {
  const suggestions = await getSuggestions();
  return <Suggestions suggestions={suggestions} />;
}

async function DashboardNotifications() {
  const notifications = await getRecentNotifications();
  return <Notifications notifications={notifications} />;
}

async function DashboardDeadlines() {
  const deadlines = await getUpcomingDeadlines();
  return <UpcomingDeadlines deadlines={deadlines} />;
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const studentData = {
    name: user.name || "Anonymous User",
    level: "Level 2: Curious Learner",
    avatar: user.image || "/placeholder.svg?height=40&width=40&text=AJ",
  };

  return (
    <div className="min-h-screen p-4 md:p-6 border-0">
      <div className="max-w-7xl mx-auto">
        <StudentHeader
          name={studentData.name}
          level={studentData.level}
          avatar={studentData.avatar}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Suspense fallback={<StatsSkeleton />}>
              <DashboardStats />
            </Suspense>

            <Suspense fallback={<CardSkeleton />}>
              <DashboardCourses />
            </Suspense>

            <Suspense fallback={<CardSkeleton />}>
              <DashboardQuestions />
            </Suspense>

            <Suspense fallback={<CardSkeleton />}>
              <DashboardSuggestions />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Suspense fallback={<CardSkeleton />}>
              <DashboardNotifications />
            </Suspense>

            <QuickActions />

            <Suspense fallback={<CardSkeleton />}>
              <DashboardDeadlines />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
