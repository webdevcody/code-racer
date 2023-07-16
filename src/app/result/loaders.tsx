import { achievements } from "@/config/achievements";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import { Result } from "@prisma/client";
import { redirect } from "next/navigation";
import "server-only";

export type ParsedRacesResult = Omit<Result, "createdAt"> & {
  createdAt: string;
};

export async function getFirstRaceBadge() {
  const user = await getCurrentUser();

  if (!user) {
    return undefined;
  }

  const firstRaceAchievement = achievements.find(
    (achievement) => achievement.type === "FIRST_RACE",
  );

  const firstRaceBadge = await prisma.achievement.findFirst({
    where: {
      achievementType: "FIRST_RACE",
      userId: user.id,
    },
  });

  if (!firstRaceBadge) {
    await prisma.achievement.create({
      data: {
        achievementType: "FIRST_RACE",
        userId: user.id,
      },
    });
    return firstRaceAchievement;
  }
}

export async function getUserResultsForSnippet(
  snippetId: string,
  numberOfResults = 7,
): Promise<ParsedRacesResult[]> {
  const user = await getCurrentUser();
  if (!user) {
    // Fix it when user is not signed in. Issue-272
    redirect("/auth");
  }

  const raceResults = await prisma.result.findMany({
    where: {
      userId: user.id,
      snippetId: snippetId,
    },
    take: numberOfResults,
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsedRaceResult = raceResults.map((item) => {
    return { ...item, createdAt: formatDate(item.createdAt) };
  });
  return parsedRaceResult.reverse();
}

export async function getCurrentRaceResult(resultId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  const raceResults = await prisma.result.findUnique({
    where: {
      id: resultId,
    },
  });

  return raceResults;
}
