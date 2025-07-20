import { userWithRolesInclude } from "@/lib/types/prisma";
import { OnboardingFlow } from "./_components/OnboardingFlow";
import { triggerWelcomeNotification } from "./_actions/onboarding-actions";
import { getCurrentUser } from "@/lib/auth/user";

export default async function OnboardingPage() {
  const user = await getCurrentUser(userWithRolesInclude);
  await triggerWelcomeNotification(user);

  return <OnboardingFlow user={user} />;
}
