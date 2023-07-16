import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { createAchievement, findAchievement } from "../_actions/achievement";

export async function getFirstRaceBadge() {
  const user = await getCurrentUser();

  if (!user) {
    return undefined;
  }

  const firstRaceBadge = await findAchievement({
    achievementType: "FIRST_RACE",
  });

  if (!firstRaceBadge) {
    await createAchievement({ achievementType: "FIRST_RACE", userId: user.id });
  }

  return firstRaceBadge;
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
    take: 7,
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsedRaceResult = raceResults.map((item) => {
    return { ...item, createdAt: formatDate(item.createdAt) };
  });
  return parsedRaceResult.reverse();
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
      createdAt: "desc",
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

  return firstRaceBadge;
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
    take: 7,
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsedRaceResult = raceResults.map((item) => {
    return { ...item, createdAt: formatDate(item.createdAt) };
  });
  return parsedRaceResult.reverse();
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
      createdAt: "desc",
    },
  });

  const cardObject = [
    {
      title: "CPM",
      value: raceResults?.cpm.toString(),
    },
    {
      title: "Accuracy",
      value: raceResults?.accuracy ? `${Number(raceResults.accuracy)}%` : "0%",
    },
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
