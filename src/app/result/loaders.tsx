import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function getFirstRaceBadge() {
  const user = await getCurrentUser();

  if (!user) {
    return undefined;
  }

  const firstRaceAchievement = await prisma.achievement.findUnique({
    where: {
      type: "FIRST_RACE",
    },
  });

  if (!firstRaceAchievement) {
    throw new Error(
      "FIRST_RACE achievement was missing from database, please add it",
    );
  }

  const firstRaceBadge = await prisma.userAchievement.findFirst({
    where: {
      achievementType: firstRaceAchievement.type,
    },
  });

  if (!firstRaceBadge) {
    await prisma.userAchievement.create({
      data: {
        achievementType: firstRaceAchievement.type,
        userId: user.id,
      },
    });
    return firstRaceAchievement;
  }
}
