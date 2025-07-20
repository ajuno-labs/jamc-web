import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { UserWithRoles, userWithRolesInclude } from "../types/prisma";

export async function getAuthUser(): Promise<UserWithRoles | null> {
  const session = await auth();
  if (!session?.user?.email) return null;
  return await prisma.user.findUnique({
    where: { email: session.user.email },
    include: userWithRolesInclude,
  });
}
