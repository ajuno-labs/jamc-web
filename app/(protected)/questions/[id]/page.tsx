import { prisma } from "@/lib/db/prisma";
import { redirect, notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function QuestionRedirectPage({ params }: Props) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
    select: { id: true, slug: true },
  });

  if (!question) notFound();
  redirect(`/questions/${question.id}/${question.slug}`);
}