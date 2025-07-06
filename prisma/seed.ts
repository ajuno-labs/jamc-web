import { prisma } from "./seed/utils";
import { seedUsersAndRoles } from "./seed/users-roles";
import { seedCourses } from "./seed/courses";
import { seedQuestions } from "./seed/questions";
import { seedEnrollments } from "./seed/enrollments";

async function main() {
  try {
    const { vietnameseTeacher, vietnameseStudents } = await seedUsersAndRoles();
    const { vietnameseMath } = await seedCourses(vietnameseTeacher.id);
    for (const student of vietnameseStudents) {
      await seedEnrollments(student.id, [vietnameseMath]);
    }
    const lessons = await prisma.lesson.findMany({
      where: { courseId: vietnameseMath.id },
      select: { id: true, title: true }
    });
    await seedQuestions({
      students: vietnameseStudents.map(s => ({ id: s.id, name: s.name ?? "" })),
      course: vietnameseMath,
      lessons
    });
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
