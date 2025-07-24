import { redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/user";
import { getQuestionWithReputation } from "../_actions/question-edit-actions";
import { EditQuestionForm } from "./_components/EditQuestionForm";
interface EditQuestionPageProps {
  params: Promise<{ id: string; slug: string }>;
}

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id: questionId, slug: questionSlug } = await params;

  if (!questionId || typeof questionId !== "string") {
    notFound();
  }

  if (!questionSlug || typeof questionSlug !== "string") {
    notFound();
  }

  const [question, user] = await Promise.all([
    getQuestionWithReputation(questionId),
    getCurrentUser(),
  ]);

  if (!question) {
    notFound();
  }

  if (question.slug !== questionSlug) {
    return redirect({
      href: `/questions/${questionId}/${question.slug}/edit`,
      locale: "en",
    });
  }

  if (!user || user.id !== question.author.id) {
    return redirect({
      href: `/questions/${questionId}/${question.slug}`,
      locale: "en",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
        <EditQuestionForm question={question} questionId={questionId} questionSlug={questionSlug} />
      </div>
    </div>
  );
}
