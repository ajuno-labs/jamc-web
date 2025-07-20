import StudentDashboard from "./student-dashboard";
import { getUserWithStats } from "@/lib/utils/user";
import { getLocale } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "@/i18n/navigation";

export default async function Page() {
  const session = await auth();
  const locale = await getLocale();
  if (!session) {
    return redirect({ href: "/signin", locale });
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user!.email!,
    },
  });
  const userWithStats = await getUserWithStats(user!.id);
  return <StudentDashboard user={userWithStats} />;
}
