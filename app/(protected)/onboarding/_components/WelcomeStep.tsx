import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Sparkles } from "lucide-react"
import { type UserWithRoles } from "@/lib/types/prisma"

interface WelcomeStepProps {
  user: UserWithRoles
  onNext: () => void
  onSkip: () => void
}

export function WelcomeStep({ user, onNext, onSkip }: WelcomeStepProps) {
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
            Welcome to JAMC!
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            Hello {user.name || "there"}, we&apos;re excited to have you on board
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-base">
            JAMC is your comprehensive learning management platform where education meets innovation.
          </p>
          <p className="text-base">
            Whether you&apos;re here to teach or learn, we&apos;ll help you get started with a quick setup.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onNext} size="lg" className="flex-1 sm:flex-none">
            Get Started
          </Button>
          <Button variant="outline" onClick={onSkip} size="lg" className="flex-1 sm:flex-none">
            Skip Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 