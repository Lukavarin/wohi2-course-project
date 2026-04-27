const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
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
  const hashedPassword = await bcrypt.hash("1234", 10);
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  console.log("Created user:", user.email);


  for (const question of seedquestions) {
    await prisma.question.create({
      data: {
        question: question.question,
        answer: question.answer,
        userId: user.id
      },
    });
  }

  console.log("Seeded 4 questions");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());