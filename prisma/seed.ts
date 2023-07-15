import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.achievement.upsert({
    where: { type: "FIRST_RACE" },
    update: {},
    create: {
      type: "FIRST_RACE",
      image: "/static/first.png",
      name: "First Race",
    },
  });

  await prisma.achievement.upsert({
    where: { type: "FIRST_SNIPPET" },
    update: {},
    create: {
      type: "FIRST_SNIPPET",
      image: "/static/first.png",
      name: "First Snippet",
    },
  });
}
main();
