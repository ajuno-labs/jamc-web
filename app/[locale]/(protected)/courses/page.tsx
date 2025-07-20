import CoursesClient from "./_components/CoursesClient";
import { getCurrentUser } from "@/lib/auth/user";
import { userWithRolesInclude } from "@/lib/types/prisma";

export default async function CoursesPage() {
  const user = await getCurrentUser(userWithRolesInclude);
  const isTeacher = user?.roles.some((role) => role.name.toLowerCase() === "teacher") ?? false;
  return <CoursesClient isTeacher={isTeacher} />;
}
