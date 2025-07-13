"use client";

import { Control, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { QuestionType, Visibility } from "@prisma/client";
import { useTranslations } from "next-intl";

// Define the form values type
type QuestionFormValues = {
  title: string;
  content: string;
  type: QuestionType;
  visibility: Visibility;
  topic?: string;
};

interface QuestionTypeToggleProps {
  control: Control<QuestionFormValues>;
  selectedTypeValue: QuestionType;
  isSubmitting: boolean;
}

export function QuestionTypeToggle({
  control,
  selectedTypeValue,
  isSubmitting,
}: QuestionTypeToggleProps) {
  const t = useTranslations('AskQuestionPage.QuestionForm');

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Label htmlFor="question-type" className="text-base font-medium">
              {selectedTypeValue === QuestionType.FORMAL ? t('formalMode') : t('yoloMode')}
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <div className="space-y-2">
                  <p><strong>{t('formalMode')}:</strong> {t('formalModeTooltip')}</p>
                  <p><strong>{t('yoloMode')}:</strong> {t('yoloModeTooltip')}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedTypeValue === QuestionType.FORMAL 
              ? t('formalModeDescription')
              : t('yoloModeDescription')
            }
          </p>
        </div>
      </div>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Switch
            id="question-type"
            checked={field.value === QuestionType.FORMAL}
            onCheckedChange={(checked) => 
              field.onChange(checked ? QuestionType.FORMAL : QuestionType.YOLO)
            }
            disabled={isSubmitting}
          />
        )}
      />
    </div>
  );
} 
