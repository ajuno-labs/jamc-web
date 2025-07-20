"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, CheckCircle, Award, Flame } from "lucide-react";
import { useTranslations } from "next-intl";

interface StatsCardsProps {
  questionsAsked: number;
  answersReceived: number;
  badges: number;
  studyStreak: number;
}

export default function StatsCards({
  questionsAsked,
  answersReceived,
  badges,
  studyStreak,
}: StatsCardsProps) {
  const t = useTranslations("Dashboard.stats");

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">{t("questionsAsked")}</p>
              <p className="text-2xl font-bold">{questionsAsked}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">{t("answersReceived")}</p>
              <p className="text-2xl font-bold">{answersReceived}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">{t("badgesEarned")}</p>
              <p className="text-2xl font-bold">{badges}</p>
            </div>
            <Award className="h-8 w-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">{t("studyStreak")}</p>
              <p className="text-2xl font-bold">{studyStreak} {t("days")}</p>
            </div>
            <Flame className="h-8 w-8 text-orange-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
