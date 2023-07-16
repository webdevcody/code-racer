import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { createAchievement, findAchievement } from "../_actions/achievement";

export async function getFirstRaceBadge() {
  const user = await getCurrentUser();

  if (!user) {
    return undefined;
  }

  const firstRaceBadge = await findAchievement({
    achievementType: "FIRST_RACE"
  });

  if (!firstRaceBadge) {
    await createAchievement({ achievementType: "FIRST_RACE", userId: user.id });
  }

  return firstRaceBadge;
}
