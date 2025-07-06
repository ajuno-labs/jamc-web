import { getAuthUser } from "@/lib/auth/get-user";
import CoursesClient from "./_components/CoursesClient";

export default async function CoursesPage() {
  const user = await getAuthUser();
  console.log("User", user?.roles);
  const isTeacher =
    user?.roles.some((role: { name: string }) => role.name.toLowerCase() === "teacher") ?? false;
  return <CoursesClient isTeacher={isTeacher} />;
}
