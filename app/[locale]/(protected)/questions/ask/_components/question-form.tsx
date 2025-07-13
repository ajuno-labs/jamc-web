"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, HelpCircle } from "lucide-react";
import { TagFilter } from "../../components/tag-filter";
import { createQuestion } from "../../_actions/create-question";
import { getMyCoursesWithLessons } from "../../../courses/_actions/course-actions";
import { Input } from "@/components/ui/input";
import { AttachmentUpload } from "./AttachmentUpload";
import { AttachmentGallery } from "./AttachmentGallery";
import { QuestionType, Visibility } from "@prisma/client";
import { QuestionContext } from "@/lib/types/question";
import { toast } from "sonner";
import PostingGuideline from "./posting-guideline";
import SimilarQuestion from "./similar-question";
import { QuestionFormFields } from "../../_components/QuestionFormFields";
import { Tag, ExistingQuestion, SimilarQuestion as SimilarQuestionType, searchSimilarQuestions } from "../_actions/ask-data";
import { useTranslations } from "next-intl";

// Define the form schema with zod
const createQuestionSchema = (t: (key: string) => string) => z.object({
  title: z
    .string()
    .min(10, { message: t('validation.titleMin') })
    .max(150, { message: t('validation.titleMax') }),
  content: z
    .string()
    .min(20, { message: t('validation.contentMin') }),
  type: z.nativeEnum(QuestionType, {
    errorMap: () => ({ message: t('validation.typeRequired') }),
  }),
  visibility: z.nativeEnum(Visibility, {
    errorMap: () => ({ message: t('validation.visibilityRequired') }),
  }),
  topic: z.string().optional(),
});

type QuestionFormValues = z.infer<ReturnType<typeof createQuestionSchema>>;

interface QuestionFormProps {
  tags: Tag[];
  context: QuestionContext;
  existingQuestions: ExistingQuestion[];
  searchSimilarQuestions: typeof searchSimilarQuestions;
}

interface EnrolledCourse {
  id: string;
  title: string;
  slug: string;
  lessons: {
    id: string;
    title: string;
    slug: string;
    order: number;
  }[];
}

export function QuestionForm({
  tags,
  context,
  existingQuestions,
  searchSimilarQuestions,
}: QuestionFormProps) {
  void tags;
  const t = useTranslations('AskQuestionPage.QuestionForm');
  const questionSchema = createQuestionSchema(t);

  const [localContext, setLocalContext] = useState<QuestionContext>(context);
  const [allQuestions] = useState<ExistingQuestion[]>(existingQuestions);
  const router = useRouter();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [similarQuestions, setSimilarQuestions] = useState<SimilarQuestionType[]>(
    []
  );
  const [isSimilarityLoading, setIsSimilarityLoading] = useState(false);
  const [similarityError, setSimilarityError] = useState<string | null>(null);

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
      content: "",
      type: QuestionType.FORMAL,
      visibility: Visibility.PUBLIC,
    },
  });

  // Debounced similarity check
  const debouncedSimilarityCheck = useCallback(
    debounce(async (title: string) => {
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
    }, 500), // 500ms delay
    [searchSimilarQuestions, t]
  );

  // Handle title changes to fetch similarity-based suggestions
  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // propagate to react-hook-form
    register("title").onChange(e);
    // Use debounced similarity check
    debouncedSimilarityCheck(title);
  };

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  const contentValue = watch("content"); // raw Markdown/LaTeX text
  const selectedTypeValue = watch("type");

  const onSubmit = async (data: QuestionFormValues) => {
    if (selectedTags.length === 0) {
      toast.error(t('validation.tagsRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('type', data.type);
      formData.append('visibility', data.visibility);
      if (data.type === 'FORMAL' && data.topic) {
        formData.append('topic', data.topic);
      }
      selectedTags.forEach(t => formData.append('tags', t));
      if (localContext.courseId) formData.append('courseId', localContext.courseId);
      if (localContext.lessonId) formData.append('lessonId', localContext.lessonId);
      attachments.forEach(file => formData.append('attachments', file));

      const result = await createQuestion(formData);

      if (result.success) {
        toast.success(t('postSuccess'));
        // Redirect to the new question page
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

  // Fetch courses the user is enrolled in or authored on mount
  useEffect(() => {
    setLoadingCourses(true);
    getMyCoursesWithLessons()
      .then(setCourses)
      .catch((err: Error) => setCoursesError(err.message))
      .finally(() => setLoadingCourses(false));
  }, []);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Question Type Switch - moved to top */}
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

            <QuestionFormFields
              register={register}
              errors={errors}
              contentValue={contentValue}
              isSubmitting={isSubmitting}
              showPreviewToggle={false}
              onTitleChange={handleTitleChange}
            />

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

        {selectedTypeValue === QuestionType.FORMAL && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">{t('topic')}</Label>
              <Input id="topic" {...register("topic")} disabled={isSubmitting} />
            </div>
            <AttachmentUpload onFilesSelected={setAttachments} />
            <AttachmentGallery files={attachments} onRemove={(f) => setAttachments(attachments.filter(a => a !== f))} />
          </div>
        )}

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

          {/* Course / Lesson selection */}
          <div className="space-y-2">
            <Label>{t('courseOptional')}</Label>
            {loadingCourses ? (
              <Loader2 className="animate-spin" />
            ) : coursesError ? (
              <p className="text-sm text-destructive">{coursesError}</p>
            ) : (
              <Select
                value={localContext.courseId || ""}
                onValueChange={(value) => {
                  // Only reset lessonId if user is manually changing course (not on initial load)
                  if (value !== context.courseId) {
                    setLocalContext({ courseId: value, lessonId: undefined });
                  } else {
                    setLocalContext({ courseId: value, lessonId: localContext.lessonId });
                  }
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCourse')} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {localContext.courseId && (
            <div className="space-y-2">
              <Label>{t('lessonOptional')}</Label>
              <Select
                value={localContext.lessonId || ""}
                onValueChange={(value) =>
                  setLocalContext((ctx) => ({ ...ctx, lessonId: value }))
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectLesson')} />
                </SelectTrigger>
                <SelectContent>
                  {courses
                    .find((c) => c.id === localContext.courseId)
                    ?.lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('posting')}
              </>
            ) : (
              t('postQuestion')
            )}
          </Button>
        </form>
      </div>

      <div>
        {isSimilarityLoading && <Loader2 className="animate-spin" />}
        {similarityError && (
          <p className="text-sm text-destructive">{similarityError}</p>
        )}
        {similarQuestions.length > 0 && (
          <SimilarQuestion similarQuestions={similarQuestions} />
        )}

        <PostingGuideline />
      </div>
    </div>
    </TooltipProvider>
  );
}
