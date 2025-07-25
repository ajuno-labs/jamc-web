import { prisma } from "@/prisma";

export enum Role {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

export async function getDatabaseRole(role: Role) {
  const roleRecord = await prisma.role.findFirst({
    where: { name: role },
  });
  return roleRecord;
}
