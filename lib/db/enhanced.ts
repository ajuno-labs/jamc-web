import { enhance } from "@zenstackhq/runtime";
import { prisma } from "../../prisma";
import { auth } from "@/auth";
import { UserWithRoles } from "../types/prisma";

export async function getEnhancedPrisma(user?: UserWithRoles) {
  if (user) {
    return enhance(prisma, { user });
  }

  const session = await auth();
  const fetchedUser = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!fetchedUser) {
    return enhance(prisma);
  }

  return enhance(prisma, { user: fetchedUser });
}
