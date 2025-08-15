"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MathContent } from "@/components/MathContent"
import { PreviewToggle } from "../../_components/PreviewToggle"
import { updateQuestion } from "../../_actions/question-edit-actions"
import { toast } from "sonner"

const editQuestionSchema = z.object({
  title: z
    .string()
    .min(10, { message: "Title must be at least 10 characters" })
    .max(150, { message: "Title must be less than 150 characters" }),
  content: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
})

type EditQuestionFormValues = z.infer<typeof editQuestionSchema>

interface EditQuestionFormProps {
  question: {
    id: string
    title: string
    content: string | null
    slug: string
  }
  questionId: string
  questionSlug: string
}

export function EditQuestionForm({ question, questionId, questionSlug }: EditQuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditQuestionFormValues>({
    resolver: zodResolver(editQuestionSchema),
    defaultValues: {
      title: question.title,
      content: question.content || "",
    },
  })

  const contentValue = watch("content")

  const onSubmit = async (data: EditQuestionFormValues) => {
    setIsSubmitting(true)

    try {
      await updateQuestion(questionId, data.title, data.content)
      toast.success("Question updated successfully!")
      router.push(`/questions/${questionId}/${questionSlug}`)
    } catch (error) {
      console.error("Error updating question:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update question")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/questions/${questionId}/${questionSlug}`)
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Question Title</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="e.g., How do I solve quadratic equations?"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="content">Description</Label>
            <PreviewToggle
              isPreview={isPreview}
              onToggle={() => setIsPreview(!isPreview)}
            />
          </div>
          
          {isPreview ? (
            <Card className="p-4 bg-muted/50 min-h-[200px]">
              <MathContent content={contentValue || ""} />
            </Card>
          ) : (
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Provide more details about your question..."
              rows={12}
              disabled={isSubmitting}
            />
          )}
          {errors.content && (
            <p className="text-sm text-destructive">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? "Updating..." : "Update Question"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
} 
