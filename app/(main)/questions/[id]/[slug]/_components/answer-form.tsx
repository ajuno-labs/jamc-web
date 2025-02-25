"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addAnswer } from "../_actions/question-actions"
import { toast } from "sonner"

const answerSchema = z.object({
  content: z.string().min(10, "Answer must be at least 10 characters long"),
})

type AnswerFormValues = z.infer<typeof answerSchema>

interface AnswerFormProps {
  questionId: string
}

export function AnswerForm({ questionId }: AnswerFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: "",
    },
  })

  const onSubmit = (data: AnswerFormValues) => {
    startTransition(async () => {
      try {
        await addAnswer(questionId, data.content)
        form.reset()
        toast.success("Answer posted successfully!")
      } catch (error) {
        toast.error("You must be logged in to answer")
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
      <Textarea
        placeholder="Write your answer here..."
        {...form.register("content")}
        className="mb-2"
      />
      {form.formState.errors.content && (
        <p className="text-sm text-red-500 mb-2">
          {form.formState.errors.content.message}
        </p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Posting..." : "Add Answer"}
      </Button>
    </form>
  )
} 