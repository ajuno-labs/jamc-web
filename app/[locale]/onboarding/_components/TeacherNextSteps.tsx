"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus, ArrowRight } from "lucide-react"
import { type UserWithRoles } from "@/lib/types/prisma"
import { useTranslations } from "next-intl"

interface TeacherNextStepsProps {
  user: UserWithRoles
  onComplete: () => void
  onSkip: () => void
}

export function TeacherNextSteps({ onSkip }: TeacherNextStepsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('Onboarding.teacherNextSteps')

  const handleCreateCourse = () => {
    setIsLoading(true)
    // Redirect to course creation page
    router.push("/courses/create")
  }

  const handleBrowseCourses = () => {
    router.push("/courses")
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {/* Create Course Option */}
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <BookOpen className="h-10 w-10 text-primary" />
                  <Plus className="absolute -top-1 -right-1 h-5 w-5 text-green-500 bg-background rounded-full border-2 border-background" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('createCourse.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('createCourse.description')}
                </p>
              </div>
              <Button 
                onClick={handleCreateCourse}
                disabled={isLoading}
                className="w-full"
              >
                {t('createCourse.button')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Browse Existing Courses */}
          <Card className="border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <BookOpen className="h-10 w-10 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('explorePlatform.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('explorePlatform.description')}
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={handleBrowseCourses}
                className="w-full"
              >
                {t('explorePlatform.button')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {t('footer')}
          </p>
          <Button variant="ghost" onClick={onSkip}>
            {t('setupLater')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 