import StudentDashboard from "./student-dashboard";
import { getUserWithStats } from "@/lib/utils/user";
import { getCurrentUser } from "@/lib/auth/user";

export default async function Page() {
  const user = await getCurrentUser();
  const userWithStats = await getUserWithStats(user!.id);
  return <StudentDashboard user={userWithStats} />;
}
