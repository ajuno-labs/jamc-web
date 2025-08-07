import { prisma } from "./utils";

const pseudonymousNames = [
  "Anonymous Student", "Curious Learner", "Study Buddy", "Knowledge Seeker", "Learning Explorer",
  "Question Asker", "Academic Mind", "Thoughtful Scholar", "Inquisitive Student", "Research Helper",
  "Problem Solver", "Discussion Starter", "Study Partner", "Course Explorer", "Learning Journey",
  "Academic Curious", "Knowledge Hunter", "Study Enthusiast", "Learning Pathway", "Education Seeker",
  "Course Companion", "Study Guide", "Learning Mentor", "Academic Explorer", "Knowledge Builder",
  "Study Navigator", "Learning Advocate", "Course Student", "Academic Questioner", "Knowledge Pursuer",
  "Study Researcher", "Learning Investigator", "Course Participant", "Academic Inquirer", "Knowledge Seeker Pro",
  "Study Collaborator", "Learning Pioneer", "Course Explorer Pro", "Academic Thinker", "Knowledge Discoverer",
  "Study Leader", "Learning Champion", "Course Navigator", "Academic Adventurer", "Knowledge Quest",
  "Study Master", "Learning Expert", "Course Scholar", "Academic Researcher", "Knowledge Wizard",
  "Study Genius", "Learning Guru", "Course Master", "Academic Sage", "Knowledge Oracle"
];

export async function seedPseudonymousNames() {
  console.log("Seeding pseudonymous names...");

  // Check if any pseudonymous names already exist
  const existingCount = await prisma.pseudonymousName.count();
  if (existingCount > 0) {
    console.log(`${existingCount} pseudonymous names already exist, skipping...`);
    return;
  }

  // Create pseudonymous names
  const createdNames = await prisma.pseudonymousName.createMany({
    data: pseudonymousNames.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log(`Created ${createdNames.count} pseudonymous names`);
}