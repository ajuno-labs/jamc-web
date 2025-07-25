import { prisma } from "@/prisma";
import { redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function QuestionRedirectPage({ params }: Props) {
  const { id } = await params;
  const question = await prisma.question.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!question) notFound();
  return redirect({
    href: `/questions/${question.id}/${question.slug}`,
    locale: "en",
  });
}
