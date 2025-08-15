"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QuestionType, Visibility } from "@prisma/client";
import { QuestionContext } from "@/lib/types/question";
import { toast } from "sonner";
import { Tag, ExistingQuestion, SimilarQuestion as SimilarQuestionType, searchSimilarQuestions } from "../_actions/ask-data";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";
import { createQuestion } from "../../_actions/create-question";

import { QuestionTypeToggle } from "./QuestionTypeToggle";
import { CourseLessonSelector } from "./CourseLessonSelector";
import { QuestionFormSidebar } from "./QuestionFormSidebar";
import { QuestionFormMain } from "./QuestionFormMain";
import { QuestionFormFields } from "../../_components/QuestionFormFields";
import { SubmitButton } from "@/components/ui/submit-button";
import { PseudonymousToggle } from "./PseudonymousToggle";

const createQuestionSchema = (t: (key: string) => string) => z.object({
  title: z
    .string()
    .min(10, { message: t('validation.titleMin') })
    .max(150, { message: t('validation.titleMax') }),
  content: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 20, {
      message: t('validation.contentMin'),
    }),
  type: z.nativeEnum(QuestionType, {
    errorMap: () => ({ message: t('validation.typeRequired') }),
  }),
  visibility: z.nativeEnum(Visibility, {
    errorMap: () => ({ message: t('validation.visibilityRequired') }),
  }),
});

type QuestionFormValues = z.infer<ReturnType<typeof createQuestionSchema>>;

interface QuestionFormProps {
  tags: Tag[];
  context: QuestionContext;
  existingQuestions: ExistingQuestion[];
  searchSimilarQuestions: typeof searchSimilarQuestions;
}

export function QuestionForm({
  tags,
  context,
  existingQuestions,
  searchSimilarQuestions,
}: QuestionFormProps) {
  void tags;
  void existingQuestions;
  const t = useTranslations('AskQuestionPage.QuestionForm');
  const questionSchema = createQuestionSchema(t);

  const [localContext, setLocalContext] = useState<QuestionContext>(context);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [similarQuestions, setSimilarQuestions] = useState<SimilarQuestionType[]>([]);
  const [isSimilarityLoading, setIsSimilarityLoading] = useState(false);
  const [similarityError, setSimilarityError] = useState<string | null>(null);
  const [isPseudonymous, setIsPseudonymous] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      content: undefined,
      type: QuestionType.STRUCTURED,
      visibility: Visibility.PUBLIC,
    },
  });

  const debouncedSimilarityCheck = useDebouncedCallback(
    async (title: string) => {
      if (title.length <= 10) {
        setSimilarQuestions([]);
        setSimilarityError(null);
        return;
      }

      setIsSimilarityLoading(true);
      setSimilarityError(null);
      try {
        const results = await searchSimilarQuestions(title, 5, 0.5);
        setSimilarQuestions(results);
      } catch (err) {
        console.error(err);
        setSimilarityError(t('similarity.error'));
        setSimilarQuestions([]);
      } finally {
        setIsSimilarityLoading(false);
      }
    },
    500
  );

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const title = e.target.value;
    register("title").onChange(e);
    debouncedSimilarityCheck(title);
  };

  const contentValue = watch("content");
  const titleValue = watch("title");
  const selectedTypeValue = watch("type");

  const onSubmit = async (data: QuestionFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content || '');
      formData.append('type', data.type);
      formData.append('visibility', data.visibility);
      selectedTags.forEach(t => formData.append('tags', t));
      if (localContext.courseId) formData.append('courseId', localContext.courseId);
      if (localContext.lessonId) formData.append('lessonId', localContext.lessonId);
      attachments.forEach(file => formData.append('attachments', file));
      formData.append('isPseudonymous', isPseudonymous.toString());

      const result = await createQuestion(formData);

      if (result.success) {
        toast.success(t('postSuccess'));
        router.push(`/questions/${result.questionId}/${result.slug}`);
      } else {
        toast.error(result.error || t('postError'));
      }
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error(t('unexpectedError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PseudonymousToggle
            isEnabled={isPseudonymous}
            onToggle={setIsPseudonymous}
            isSubmitting={isSubmitting}
          />
          
          <QuestionTypeToggle
            control={control}
            isSubmitting={isSubmitting}
          />

          <QuestionFormFields
            register={register}
            errors={errors}
            contentValue={contentValue}
            titleValue={titleValue}
            isSubmitting={isSubmitting}
            onTitleChange={handleTitleChange}
            allowProgressiveDisclosure={true}
          />

          <QuestionFormMain
            control={control}
            errors={errors}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            attachments={attachments}
            setAttachments={setAttachments}
            selectedTypeValue={selectedTypeValue}
            isSubmitting={isSubmitting}
          />

          <CourseLessonSelector
            localContext={localContext}
            setLocalContext={setLocalContext}
            context={context}
            isSubmitting={isSubmitting}
          />

          <SubmitButton
            isSubmitting={isSubmitting}
            submittingText={t('posting')}
            defaultText={t('postQuestion')}
          />
        </form>
      </div>

      <QuestionFormSidebar
        isSimilarityLoading={isSimilarityLoading}
        similarityError={similarityError}
        similarQuestions={similarQuestions}
      />
    </div>
  );
}
