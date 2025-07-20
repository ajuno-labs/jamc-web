"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface StudentHeaderProps {
  name: string;
  level: string;
  avatar?: string;
}

export default function StudentHeader({ name, level, avatar }: StudentHeaderProps) {
  const t = useTranslations("Dashboard.header");

  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white/20">
                <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
                <AvatarFallback className="bg-white/20 text-white text-lg">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{t("greeting", { name })}</h1>
                <Badge variant="secondary" className="mt-1 bg-white/20 text-white border-white/20">
                  {level}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg italic opacity-90" dangerouslySetInnerHTML={{ __html: t("quote") }} />
              <p className="text-sm opacity-75 mt-1">{t("author")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
