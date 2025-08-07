"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UserX } from "lucide-react";
import { useTranslations } from "next-intl";

interface PseudonymousToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  isSubmitting?: boolean;
}

export function PseudonymousToggle({ 
  isEnabled, 
  onToggle, 
  isSubmitting = false 
}: PseudonymousToggleProps) {
  const t = useTranslations('AskQuestionPage.PseudonymousToggle');

  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserX className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <Label htmlFor="pseudonymous-mode" className="text-sm font-medium">
                {t('title')}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t('description')}
              </p>
            </div>
          </div>
          <Switch
            id="pseudonymous-mode"
            checked={isEnabled}
            onCheckedChange={onToggle}
            disabled={isSubmitting}
          />
        </div>
      </CardContent>
    </Card>
  );
}