import { prisma } from "./seed/utils";
import { seedUsersAndRoles } from "./seed/users-roles";
import { seedCourses } from "./seed/courses";
import { seedQuestions } from "./seed/questions";
import { seedEnrollments } from "./seed/enrollments";

async function main() {
  try {
    // Seed users and roles
    const { vietnameseTeacher, vietnameseStudents } = await seedUsersAndRoles();

    // Seed Vietnamese high school math course
    const { vietnameseMath } = await seedCourses(vietnameseTeacher.id);

    // Enroll all 20 Vietnamese students in the Vietnamese math course
    for (const student of vietnameseStudents) {
      await seedEnrollments(student.id, [vietnameseMath]);
    }

    // Fetch all lessons for the Vietnamese math course
    const lessons = await prisma.lesson.findMany({
      where: { courseId: vietnameseMath.id },
      select: { id: true, title: true }
    });

    // Seed 100 Vietnamese math questions
    await seedQuestions({
      students: vietnameseStudents.map(s => ({ id: s.id, name: s.name ?? "" })),
      course: vietnameseMath,
      lessons
    });

    // TODO: Seed 100 Vietnamese math questions (next step)

    // --- Commented out old demo data ---
    // const { teacherUsers, studentUsers, mainTeacher, mainStudent } = await seedUsersAndRoles();
    // const { calculus1, linearAlgebra } = await seedCourses(mainTeacher.id);
    // ...
    // await seedQuestions(mainStudent.id, calculus1.id, linearAlgebra.id);
    // ...

    console.log("Vietnamese math demo database seeded successfully");
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
