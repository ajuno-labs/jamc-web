import { getAuthUser } from "@/lib/auth/get-user";
import CoursesClient from "./_components/CoursesClient";

/**
 * Renders the courses page, determining if the authenticated user has a teacher role.
 *
 * Retrieves the authenticated user and checks if any of their roles is "teacher" (case-insensitive). Passes this information as the `isTeacher` prop to the `CoursesClient` component.
 */
export default async function CoursesPage() {
  const user = await getAuthUser();
  console.log("User", user?.roles);
  const isTeacher =
    user?.roles.some((role: { name: string }) => role.name.toLowerCase() === "teacher") ?? false;
  return <CoursesClient isTeacher={isTeacher} />;
}
