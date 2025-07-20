"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

type UserWithInclude<T extends Prisma.UserInclude | undefined> = T extends Prisma.UserInclude
  ? Prisma.UserGetPayload<{ include: T }>
  : Prisma.UserGetPayload<Record<string, never>>;

/**
 * Get the current authenticated user
 * Since middleware validates authentication, this will always return a user
 * @param include - Optional Prisma include object for related data
 */
export async function getCurrentUser<T extends Prisma.UserInclude | undefined = undefined>(
  include?: T
): Promise<UserWithInclude<T>> {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Authentication required");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: include,
  });
  if (!user) {
    throw new Error("User not found");
  }

  return user as UserWithInclude<T>;
}
