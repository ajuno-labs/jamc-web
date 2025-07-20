import { enhance } from "@zenstackhq/runtime";
import { prisma } from "./prisma";
import { auth } from "@/auth";

export async function getEnhancedPrisma() {
  const session = await auth();
  const user = await prisma.user.findUnique({
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

  if (!user) {
    return enhance(prisma);
  }

  return enhance(prisma, { user });
}
