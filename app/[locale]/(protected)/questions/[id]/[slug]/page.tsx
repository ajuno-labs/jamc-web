import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { userWithRolesInclude } from "@/lib/types/prisma";
import { QuestionHeader } from "./_components/question-header";
import { AnswerList } from "./_components/answer-list";
import { AnswerForm } from "./_components/answer-form";
import { RelatedQuestions } from "./_components/related-questions";
import { getRelatedQuestions } from "./_actions/question-actions";
import {
  getQuestionWithReputation,
  getAnswersWithReputation,
} from "./_actions/question-edit-actions";
import { redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { hasPermission } from "@/lib/types/prisma";

interface QuestionPageProps {
  params: Promise<{ id: string; slug: string }>;
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { id: questionId, slug: questionSlug } = await params;

  if (!questionId || typeof questionId !== "string") {
    notFound();
  }

  if (!questionSlug || typeof questionSlug !== "string") {
    notFound();
  }

  const [question, answers, relatedQuestions, user] = await Promise.all([
    getQuestionWithReputation(questionId),
    getAnswersWithReputation(questionId),
    getRelatedQuestions(questionId),
    (async () => {
      const session = await auth();
      return await prisma.user.findUnique({
        where: {
          email: session!.user!.email!,
        },
        include: userWithRolesInclude,
      });
    })(),
  ]);

  if (!question) {
    notFound();
  }

  if (question.slug !== questionSlug) {
    return redirect({
      href: `/questions/${questionId}/${question.slug}`,
      locale: "en",
    });
  }

  const isEducator = hasPermission(user, "MANAGE");

  let currentUserVote = null;
  if (user) {
    const userVote = question.votes.find(
      (vote: { userId?: string; value: number }) => vote.userId === user.id
    );
    if (userVote) {
      currentUserVote = userVote.value;
    }
  }

  const enhancedQuestion = {
    ...question,
    currentUserVote,
    course: question.course ?? undefined,
    lesson: question.lesson ?? undefined,
    slug: question.slug,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-8">
          <QuestionHeader question={enhancedQuestion} currentUserId={user?.id} />
          <AnswerList answers={answers} currentUserId={user?.id} isEducator={isEducator} />
          <AnswerForm questionId={questionId} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <RelatedQuestions questions={relatedQuestions} />
        </aside>
      </div>
    </div>
  );
}
