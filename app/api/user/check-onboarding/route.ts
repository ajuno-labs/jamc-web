import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { userWithRolesInclude } from "@/lib/types/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    include: userWithRolesInclude,
  });

  if (!user) {
    return NextResponse.json({ needsOnboarding: false }, { status: 401 });
  }

  const needsOnboarding = user.roles.length === 0;

  return NextResponse.json({ needsOnboarding });
}
