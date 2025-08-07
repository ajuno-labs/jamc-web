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
import { useTranslations } from "next-intl"

const createAnswerSchema = (t: (key: string) => string) => z.object({
  content: z.string().min(10, t('validation.minLength')),
})

type AnswerFormValues = {
  content: string
}

interface AnswerFormProps {
  questionId: string
}

export function AnswerForm({ questionId }: AnswerFormProps) {
  const t = useTranslations("AnswerForm")
  const [isPending, startTransition] = useTransition()

  const answerSchema = createAnswerSchema(t)
  
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
        toast.success(t('success'))
      } catch {
        toast.error(t('loginRequired'))
      }
    })
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Textarea
            placeholder={t('placeholder')}
            {...form.register("content")}
            className="mb-2 min-h-[150px]"
          />
          {form.formState.errors.content && (
            <p className="text-sm text-destructive mb-2">
              {form.formState.errors.content.message}
            </p>
          )}
          <Button type="submit" disabled={isPending} className="mt-4">
            {isPending ? t('posting') : t('addAnswer')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
