import { prisma } from "./utils";
import { PermissionType } from "@prisma/client";
import { Role } from "../../lib/types/roles";

export async function seedRolesAndPermissions() {
  console.log("Seeding roles and permissions...");

  const permissions = await createPermissions();
  const { adminRole, teacherRole, studentRole } = await createRoles(permissions);

  console.log("Roles and permissions seeded successfully");

  return { permissions, adminRole, teacherRole, studentRole };
}

async function createPermissions() {
  return await Promise.all([
    prisma.permission.upsert({
      where: { id: 1 },
      update: { name: PermissionType.READ },
      create: { id: 1, name: PermissionType.READ },
    }),
    prisma.permission.upsert({
      where: { id: 2 },
      update: { name: PermissionType.CREATE },
      create: { id: 2, name: PermissionType.CREATE },
    }),
    prisma.permission.upsert({
      where: { id: 3 },
      update: { name: PermissionType.UPDATE },
      create: { id: 3, name: PermissionType.UPDATE },
    }),
    prisma.permission.upsert({
      where: { id: 4 },
      update: { name: PermissionType.DELETE },
      create: { id: 4, name: PermissionType.DELETE },
    }),
    prisma.permission.upsert({
      where: { id: 5 },
      update: { name: PermissionType.MANAGE },
      create: { id: 5, name: PermissionType.MANAGE },
    }),
  ]);
}

async function createRoles(permissions: any[]) {
  const adminRole = await upsertRole(
    1,
    Role.ADMIN,
    permissions.map((p) => p.id)
  );

  const teacherRole = await upsertRole(
    2,
    Role.TEACHER,
    [permissions[0].id, permissions[1].id, permissions[2].id] // READ, CREATE, UPDATE
  );

  const studentRole = await upsertRole(
    3,
    Role.STUDENT,
    [permissions[0].id] // READ
  );

  return { adminRole, teacherRole, studentRole };
}

/**
 * Helper function to create or update a role with given permissions.
 * @param {number} id - The role's unique id.
 * @param {Role} name - The role's name (enum).
 * @param {Array} permissionIds - Array of permission ids to connect.
 * @returns {Promise<any>} The upserted role.
 */
async function upsertRole(id: number, name: Role, permissionIds: number[]) {
  return prisma.role.upsert({
    where: { id },
    update: {
      name,
      permissions: {
        connect: permissionIds.map((pid) => ({ id: pid })),
      },
    },
    create: {
      id,
      name,
      permissions: {
        connect: permissionIds.map((pid) => ({ id: pid })),
      },
    },
  });
}
