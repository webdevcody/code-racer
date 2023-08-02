import { PrismaClient, type Notification } from "@prisma/client";
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

  // Notifications
  const admin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });
  if (admin) {
    const notifications = Array(40)
      .fill({ title: "", description: "", userId: "" })
      .map((value, index) => ({
        ...value,
        title: `${index} test`,
        description: "This is a test notification",
        userId: admin.id,
      }));
    notifications.forEach(async (notification) => {
      await prisma.notification.create({
        data: notification,
      });
    });
    console.log("Generated dummy notifications");
  }
}

main();
