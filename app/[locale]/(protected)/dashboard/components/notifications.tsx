"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

interface Notification {
  type: "answer" | "deadline" | "badge";
  message: string;
  time: string;
}

interface NotificationsProps {
  notifications: Notification[];
}

export default function Notifications({ notifications }: NotificationsProps) {
  const t = useTranslations("Dashboard.notifications");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div key={index} className="p-3 rounded-lg bg-accent/50">
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
          {t("viewAll")}
        </Button>
      </CardContent>
    </Card>
  );
}
