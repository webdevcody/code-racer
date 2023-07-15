import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.achievement.upsert({
    where: { type: "FIRST_RACE" },
    update: {},
    create: {
      type: "FIRST_RACE",
      image: "/first.png",
      name: "First Race",
    },
  });

  await prisma.achievement.upsert({
    where: { type: "FIRST_SNIPPET" },
    update: {},
    create: {
      type: "FIRST_SNIPPET",
      image: "/first.png",
      name: "First Snippet",
    },
  });
}
main();
