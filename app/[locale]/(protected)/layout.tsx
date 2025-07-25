import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { OnboardingRedirect } from "./_components/OnboardingRedirect";
import { getCurrentUser } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { userWithRolesInclude, hasCompletedOnboarding } from "@/lib/types/prisma";

export default async function Layout({ children }: { children: React.ReactNode }) {

  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin');
  }

  const locale = await getLocale();

  const user = await getCurrentUser(userWithRolesInclude);
  if (!hasCompletedOnboarding(user)) {
    redirect(`/${locale}/onboarding`);
  }

  return (
    <SessionProvider session={session}>
      <OnboardingRedirect />
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <Header user={session?.user} />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
