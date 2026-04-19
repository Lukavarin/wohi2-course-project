const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedquestions = [
  {
    question: "What is a photon?",
    answer: "A discrete packet of light energy."
  },
  {
    question: "What is the photoelectric effect?",
    answer: "The emission of electrons when light hits a material."
  },
  {
    question: "What does the principal quantum number represent?",
    answer: "It represents the main energy level of an electron."
  },
  {
    question: "What is a wave function?",
    answer: "A mathematical description of the quantum state of a particle."
  },
];

async function main() {
  await prisma.question.deleteMany();

  for (const question of seedquestions) {
    await prisma.question.create({
      data: {
        question: question.question,
        answer: question.answer,
      },
    });
  }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());