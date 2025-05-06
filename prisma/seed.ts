import { prisma } from "./seed/utils";
import { seedUsersAndRoles } from "./seed/users-roles";
import { seedCourses } from "./seed/courses";
import { seedQuestions } from "./seed/questions";
import { seedEnrollments } from "./seed/enrollments";

async function main() {
  try {
    // Seed users and roles
    const { teacherUsers, studentUsers, mainTeacher, mainStudent } =
      await seedUsersAndRoles();

    // Seed courses with lessons
    const { calculus1, linearAlgebra } = await seedCourses(mainTeacher.id);

    // Create additional courses for other teachers
    const statistics = await prisma.course.upsert({
      where: { slug: "statistics-fundamentals" },
      update: {},
      create: {
        title: "Statistics Fundamentals",
        description:
          "An introduction to statistics and probability. This course covers descriptive statistics, probability distributions, hypothesis testing, and regression analysis.",
        slug: "statistics-fundamentals",
        authorId: teacherUsers[2].id, // David Chen
        tags: {
          connect: [{ name: "Mathematics" }, { name: "Statistics" }],
        },
        lessons: {
          create: [
            {
              title: "Introduction to Statistics",
              slug: "introduction-to-statistics",
              summary:
                "# Introduction to Statistics\n\nStatistics is the science of collecting, analyzing, and interpreting data...",
              order: 1,
            },
            {
              title: "Probability Basics",
              slug: "probability-basics",
              summary:
                "# Probability Basics\n\nProbability is the measure of the likelihood of an event occurring...",
              order: 2,
            },
          ],
        },
      },
    });

    const discreteMath = await prisma.course.upsert({
      where: { slug: "discrete-mathematics" },
      update: {},
      create: {
        title: "Discrete Mathematics",
        description:
          "A comprehensive course on discrete mathematics covering logic, set theory, combinatorics, graph theory, and number theory.",
        slug: "discrete-mathematics",
        authorId: teacherUsers[1].id, // Sarah Johnson
        tags: {
          connect: [{ name: "Mathematics" }, { name: "Discrete Mathematics" }],
        },
        lessons: {
          create: [
            {
              title: "Logic and Proofs",
              slug: "logic-and-proofs",
              summary:
                "# Logic and Proofs\n\nLogic is the foundation of mathematical reasoning...",
              order: 1,
            },
            {
              title: "Set Theory",
              slug: "set-theory",
              summary:
                "# Set Theory\n\nSet theory is the branch of mathematics that studies sets...",
              order: 2,
            },
          ],
        },
      },
    });

    // Enroll students in various courses
    // Main student in all courses
    await seedEnrollments(mainStudent.id, [
      calculus1,
      linearAlgebra,
      statistics,
      discreteMath,
    ]);

    // Bob in Calculus and Linear Algebra
    await seedEnrollments(studentUsers[1].id, [calculus1, linearAlgebra]);

    // Carol in Statistics and Discrete Math
    await seedEnrollments(studentUsers[2].id, [statistics, discreteMath]);

    // Dave in all math courses
    await seedEnrollments(studentUsers[3].id, [
      calculus1,
      linearAlgebra,
      statistics,
      discreteMath,
    ]);

    // Seed questions from various students
    await seedQuestions(mainStudent.id, calculus1.id, linearAlgebra.id);
    await seedQuestions(studentUsers[1].id, calculus1.id, linearAlgebra.id);
    await seedQuestions(studentUsers[2].id, statistics.id, discreteMath.id);

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
