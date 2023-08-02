import { PrismaClient, type Notification, Achievement, AchievementType } from "@prisma/client";
import snippets from "./seed-data/snippets";
import usersSeed from "./seed-data/users.seed";


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

  // Seed for leaderboard
  for (const user of usersSeed) {
    await prisma.user.upsert({
      where: { id: user.id },
      create: user,
      update: { averageAccuracy: user.averageAccuracy, averageCpm: user.averageCpm }
    });

    await prisma.achievement.upsert({
      where: {
        userId_achievementType: {
          userId: user.id,
          achievementType: "FIFTH_RACE"
        }
      },
      create: { userId: user.id, achievementType: "FIFTH_RACE" },
      update: {}
    });
  }
}

main();
