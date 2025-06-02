"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
      } catch {
        toast.error("You must be logged in to answer")
      }
    })
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <h2 className="text-xl font-semibold">Your Answer</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Textarea
            placeholder="Write your answer here..."
            {...form.register("content")}
            className="mb-2 min-h-[150px]"
          />
          {form.formState.errors.content && (
            <p className="text-sm text-destructive mb-2">
              {form.formState.errors.content.message}
            </p>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Posting..." : "Add Answer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 