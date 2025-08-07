"use client";

import { Control, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Target, FileText, MessageCircle } from "lucide-react";
import { QuestionType, Visibility } from "@prisma/client";
import { useTranslations } from "next-intl";

type QuestionFormValues = {
  title: string;
  content: string;
  type: QuestionType;
  visibility: Visibility;
  topic?: string;
};

interface QuestionTypeToggleProps {
  control: Control<QuestionFormValues>;
  isSubmitting: boolean;
}

const createQuestionTypeConfig = (t: (key: string) => string) => ({
  [QuestionType.OBJECTIVE]: {
    icon: Target,
    label: t('questionType.objective'),
    description: t('questionType.objectiveDescription'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  [QuestionType.STRUCTURED]: {
    icon: FileText,
    label: t('questionType.structured'),
    description: t('questionType.structuredDescription'),
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  [QuestionType.OPINION]: {
    icon: MessageCircle,
    label: t('questionType.opinion'),
    description: t('questionType.opinionDescription'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
});

export function QuestionTypeToggle({
  control,
  isSubmitting,
}: QuestionTypeToggleProps) {
  const t = useTranslations('AskQuestionPage.QuestionForm');

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-2">
        <Label className="text-base font-medium">{t('questionType.label')}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-2">
              <p><strong>{t('questionType.objective')}:</strong> {t('questionType.objectiveDescription')}</p>
              <p><strong>{t('questionType.structured')}:</strong> {t('questionType.structuredDescription')}</p>
              <p><strong>{t('questionType.opinion')}:</strong> {t('questionType.opinionDescription')}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            disabled={isSubmitting}
            className="grid grid-cols-3 gap-2 md:gap-3"
          >
            {Object.entries(createQuestionTypeConfig(t)).map(([type, config]) => {
              const Icon = config.icon;
              const isSelected = field.value === type;
              
              return (
                <Tooltip key={type}>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <RadioGroupItem
                        value={type}
                        id={type}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={type}
                        className={`flex flex-col items-center justify-center h-16 md:h-20 p-2 md:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? `${config.bgColor} ${config.borderColor} ${config.color}`
                            : 'bg-background border-border hover:bg-muted/50'
                        }`}
                      >
                        <Icon className={`h-4 w-4 md:h-6 md:w-6 mb-1 ${isSelected ? config.color : 'text-muted-foreground'}`} />
                        <span className="font-medium text-xs leading-tight text-center">{config.label}</span>
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{config.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </RadioGroup>
        )}
      />
    </div>
  );
} 
