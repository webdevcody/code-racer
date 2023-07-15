import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";

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

export async function getUserResultsForSnippet(snippetId: string) {
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
    take:7,
    orderBy: {
      createdAt: "asc"
    }
  });
  const parsedRaceResult = raceResults.map(item=>{
    return {...item, createdAt: formatDate(item.createdAt)}
  })
  return parsedRaceResult;
}

export async function getCurrentRaceResult(snippetId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth");
  }

  const raceResults = await prisma.result.findFirst({
    where: {
      userId: user.id,
      snippetId: snippetId,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const cardObject = [
    {
      title: "CPM",
      value: raceResults?.cpm.toString(),
    },
    { title: "Accuracy", value: raceResults?.accuracy ? `${Number(raceResults.accuracy)}%` : "0%"},
    {
      title: "Misses",
      value: raceResults?.errorCount?.toString(),
    },
    {
      title: "Time Taken",
      value: `${raceResults?.takenTime}s`,
    },
  ];

  return cardObject;
}
