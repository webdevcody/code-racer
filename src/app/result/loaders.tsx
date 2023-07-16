import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Result } from "@prisma/client";

export type ParsedRacesResult = Omit<Result, "createdAt"> & {
  createdAt: string;
};

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
