"use client";

import { Control, Controller, UseFormRegister, FieldErrors } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TagFilter } from "../../components/tag-filter";
import { AttachmentUpload } from "./AttachmentUpload";
import { AttachmentGallery } from "./AttachmentGallery";
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

interface QuestionFormMainProps {
  register: UseFormRegister<QuestionFormValues>;
  control: Control<QuestionFormValues>;
  errors: FieldErrors<QuestionFormValues>;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  attachments: File[];
  setAttachments: (files: File[]) => void;
  selectedTypeValue: QuestionType;
  isSubmitting: boolean;
}

export function QuestionFormMain({
  register,
  control,
  errors,
  selectedTags,
  setSelectedTags,
  attachments,
  setAttachments,
  selectedTypeValue,
  isSubmitting,
}: QuestionFormMainProps) {
  const t = useTranslations('AskQuestionPage.QuestionForm');

  return (
    <div className="space-y-6">
      {/* Tags */}
      <div className="space-y-2">
        <Label>{t('tags')}</Label>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />
        {selectedTags.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t('tagsHint')}
          </p>
        )}
      </div>

      {/* Topic and Attachments (Structured mode only) */}
      {selectedTypeValue === QuestionType.STRUCTURED && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">{t('topic')}</Label>
            <Input id="topic" {...register("topic")} disabled={isSubmitting} />
          </div>
          <AttachmentUpload onFilesSelected={setAttachments} />
          <AttachmentGallery 
            files={attachments} 
            onRemove={(f) => setAttachments(attachments.filter(a => a !== f))} 
          />
        </div>
      )}

      {/* Visibility */}
      <div className="space-y-2">
        <Label htmlFor="visibility">{t('visibility')}</Label>
        <Controller
          name="visibility"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectVisibility')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Visibility.PUBLIC}>{t('public')}</SelectItem>
                <SelectItem value={Visibility.PRIVATE}>
                  {t('private')}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.visibility && (
          <p className="text-sm text-destructive">
            {errors.visibility.message}
          </p>
        )}
      </div>
    </div>
  );
} 
