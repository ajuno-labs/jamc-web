"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, BookOpen, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function QuickActions() {
  const t = useTranslations("Dashboard.quickActions");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            {t("askQuestion")}
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            {t("browseCourses")}
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t("viewProgress")}
          </Button>
      </CardContent>
    </Card>
  );
}
