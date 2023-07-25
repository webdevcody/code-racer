import { PrismaClient } from "@prisma/client";
import snippets from "./seed-data/snippets";

const prisma = new PrismaClient();

async function main() {
  for (const { code, language } of snippets) {
    await prisma.snippet.upsert({
      where: {
        id: `seed-${language}`,
      },
      update: {
        code,
        language,
      },
      create: {
        id: `seed-${language}`,
        code,
        language,
      },
    });
  }
}

main();
