"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { TagFilter } from "../../components/tag-filter"
import { createQuestion } from "../../_actions/create-question"
import { QuestionType, Visibility } from "@prisma/client"
import { QuestionContext } from "@/lib/types/question"
import { toast } from "sonner"
import PostingGuideline from "./posting-guideline"
import SimilarQuestion from "./similar-question"

// Define the form schema with zod
const questionSchema = z.object({
  title: z.string().min(10, { message: "Title must be at least 10 characters" }).max(150, { message: "Title must be less than 150 characters" }),
  content: z.string().min(20, { message: "Description must be at least 20 characters" }),
  type: z.nativeEnum(QuestionType, { 
    errorMap: () => ({ message: "Please select a question type" })
  }),
  visibility: z.nativeEnum(Visibility, {
    errorMap: () => ({ message: "Please select visibility" })
  }),
  topic: z.string().optional(),
})

type QuestionFormValues = z.infer<typeof questionSchema>

interface Tag {
  id: string
  name: string
  description: string | null
  count: number
}

interface QuestionFormProps {
  tags: Tag[]
  context: QuestionContext
}

export function QuestionForm({ tags, context }: QuestionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [similarQuestions, setSimilarQuestions] = useState<string[]>([])
  
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
      topic: "",
    },
  })
  
  // Watch the title field to suggest similar questions
  const titleValue = watch("title")
  
  // Handle title changes to suggest similar questions
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This is where you would call your AI service to get similar questions
    // For now, we'll just set some dummy data
    if (e.target.value.length > 10) {
      setSimilarQuestions([
        "What is the difference between velocity and acceleration?",
        "How do you calculate the area of a circle?",
        "What are the main types of chemical reactions?",
      ])
    } else {
      setSimilarQuestions([])
    }
  }
  
  const onSubmit = async (data: QuestionFormValues) => {
    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await createQuestion({
        ...data,
        tags: selectedTags,
      })
      
      if (result.success) {
        toast.success("Question posted successfully!")
        // Redirect to the new question page
        router.push(`/questions/${result.questionId}/${result.slug}`)
      } else {
        toast.error(result.error || "Failed to post question")
      }
    } catch (error) {
      console.error("Error posting question:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              {...register("title")}
              onChange={(e) => {
                register("title").onChange(e)
                handleTitleChange(e)
              }}
              placeholder="e.g., How do I solve quadratic equations?"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Provide more details about your question..."
              rows={8}
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagFilter 
              selectedTags={selectedTags} 
              onTagsChange={setSelectedTags} 
            />
            {selectedTags.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Select at least one tag to categorize your question
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Question Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={QuestionType.FORMAL}>Formal</SelectItem>
                      <SelectItem value={QuestionType.YOLO}>YOLO</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
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
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Visibility.PUBLIC}>Public</SelectItem>
                      <SelectItem value={Visibility.PRIVATE}>Private</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.visibility && (
                <p className="text-sm text-destructive">{errors.visibility.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Course/Module (Optional)</Label>
            <Input
              id="topic"
              {...register("topic")}
              placeholder="e.g., Mathematics 101"
              disabled={isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting Question...
              </>
            ) : (
              "Post Question"
            )}
          </Button>
        </form>
      </div>

      <div>
        {similarQuestions.length > 0 && (
          <SimilarQuestion similarQuestions={similarQuestions} />
        )}
        
        <PostingGuideline />
      </div>
    </div>
  )
} 