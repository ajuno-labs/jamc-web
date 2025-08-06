"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, ArrowRight, Search } from "lucide-react";
import { type UserWithRoles } from "@/lib/types/prisma";
import { joinCourseWithCode } from "../actions/onboarding-actions";
import { useTranslations } from "next-intl";

interface StudentNextStepsProps {
  user: UserWithRoles;
  onComplete: () => void;
  onSkip: () => void;
}

export function StudentNextSteps({ onSkip }: StudentNextStepsProps) {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const t = useTranslations('Onboarding.studentNextSteps');

  const handleJoinCourse = async () => {
    if (!joinCode.trim()) return;

    setIsJoining(true);
    setJoinError(null);

    try {
      const result = await joinCourseWithCode(joinCode.trim().toUpperCase());

      if (result.success) {
        // Redirect to the course
        router.push(`/courses/${result.courseSlug}`);
      } else {
        setJoinError(result.error || "Failed to join course");
      }
    } catch (error) {
      console.error("Error joining course:", error);
      setJoinError(t('joinCourse.error'));
    } finally {
      setIsJoining(false);
    }
  };

  const handleBrowseCourses = () => {
    router.push("/courses");
  };

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
          {/* Join Course with Code */}
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{t('joinCourse.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('joinCourse.description')}
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="joinCode">{t('joinCourse.codeLabel')}</Label>
                  <Input
                    id="joinCode"
                    placeholder={t('joinCourse.codePlaceholder')}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    disabled={isJoining}
                    maxLength={8}
                  />
                </div>

                {joinError && <p className="text-sm text-red-500">{joinError}</p>}

                <Button
                  onClick={handleJoinCourse}
                  disabled={!joinCode.trim() || isJoining}
                  className="w-full"
                >
                  {isJoining ? (
                    t('joinCourse.joining')
                  ) : (
                    <>
                      {t('joinCourse.button')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Browse Available Courses */}
          <Card className="border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <Search className="h-10 w-10 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('exploreCourses.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('exploreCourses.description')}
                </p>
              </div>
              <Button variant="outline" onClick={handleBrowseCourses} className="w-full">
                {t('exploreCourses.button')}
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
  );
}
