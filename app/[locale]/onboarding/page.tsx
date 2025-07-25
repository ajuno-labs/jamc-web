import { userWithRolesInclude, hasCompletedOnboarding } from "@/lib/types/prisma";
import { OnboardingFlow } from "./_components/OnboardingFlow";
import { getCurrentUser } from "@/lib/auth/user";
import { notifyWelcome } from "@/lib/services/notification-triggers";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();
  const user = await getCurrentUser(userWithRolesInclude);

  if (hasCompletedOnboarding(user)) {
    await notifyWelcome(user.id);
    redirect({
      href: {
        pathname: "/dashboard",
      },
      locale,
    });
  }

  return <OnboardingFlow user={user} />;
}
