import { getUserProfile } from "./_actions/profile-actions";
import { UserInfoCard } from "./_components/UserInfoCard";
import { QuestionsSection } from "./_components/QuestionsSection";
import { AnswersSection } from "./_components/AnswersSection";
import { BadgesSection } from "./_components/BadgesSection";
import { SubscriptionsSection } from "./_components/SubscriptionsSection";
import { NotificationsSection } from "./_components/NotificationsSection";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function ProfilePage() {
  const t = await getTranslations("ProfilePage");
  const session = await auth();
  const locale = await getLocale();
  if (!session) {
    return redirect({
      href: { pathname: "/api/auth/signin", query: { callbackUrl: "/profile" } },
      locale,
    });
  }

  const profileData = await getUserProfile();

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">{t("unableToLoad")}</p>
        </div>
      </div>
    );
  }

  const { user, questions, answers, stats } = profileData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <UserInfoCard user={user} stats={stats} />
          <BadgesSection />
          <SubscriptionsSection />
        </div>

        {/* Activity Section */}
        <div className="lg:col-span-2 space-y-6">
          <QuestionsSection questions={questions} totalQuestions={stats.totalQuestions} />
          <AnswersSection answers={answers} totalAnswers={stats.totalAnswers} />
          <NotificationsSection />
        </div>
      </div>
    </div>
  );
}
