import { prisma } from "./seed/utils";
import { seedRolesAndPermissions } from "./seed/roles-permissions";

async function main() {
  try {
    await seedRolesAndPermissions();
    
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
