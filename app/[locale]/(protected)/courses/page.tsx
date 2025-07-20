import CoursesClient from "./_components/CoursesClient";
import { getLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { prisma } from "@/lib/db/prisma";
import { userWithRolesInclude } from "@/lib/types/prisma";

export default async function CoursesPage() {
  const session = await auth();
  const locale = await getLocale();
  if (!session) {
    return redirect({ href: "/signin", locale });
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user!.email!,
    },
    include: userWithRolesInclude,
  });
  const isTeacher =
    user?.roles.some((role: { name: string }) => role.name.toLowerCase() === "teacher") ?? false;
  return <CoursesClient isTeacher={isTeacher} />;
}
