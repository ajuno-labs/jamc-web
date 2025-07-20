import StudentDashboard from "./student-dashboard";
import { getUserWithStats } from "@/lib/utils/user";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export default async function Page() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });
  const userWithStats = await getUserWithStats(user!.id);
  return <StudentDashboard user={userWithStats} />;
}
