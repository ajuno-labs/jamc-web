import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Sparkles } from "lucide-react"
import { type UserWithRoles } from "@/lib/types/prisma"
import { useTranslations } from "next-intl"

interface WelcomeStepProps {
  user: UserWithRoles
  onNext: () => void
  onSkip: () => void
  isSkipping?: boolean
}

export function WelcomeStep({ user, onNext, onSkip, isSkipping = false }: WelcomeStepProps) {
  const t = useTranslations('Onboarding.welcome')

  return (
    <Card className="text-center">
      <CardHeader className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <GraduationCap className="h-16 w-16 text-primary" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500" />
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-bold text-primary">
            {t('title')}
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            {t('greeting', { name: user.name || 'there' })}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-base">
            {t('description1')}
          </p>
          <p className="text-base">
            {t('description2')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onNext} size="lg" className="flex-1 sm:flex-none" disabled={isSkipping}>
            {t('getStarted')}
          </Button>
          <Button variant="outline" onClick={onSkip} size="lg" className="flex-1 sm:flex-none" disabled={isSkipping}>
            {isSkipping ? t('settingUp') : t('skipSetup')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 