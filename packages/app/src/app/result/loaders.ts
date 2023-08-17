import { achievements } from "@/config/achievements";
import { convertDecimalsToNumbers } from "@/lib/convertDecimalsToNumbers";
import { prisma } from "@/lib/prisma";
import { safeLoader } from "@/lib/safeLoader";
import { getCurrentUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import { Result, Snippet } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { race } from "cypress/types/bluebird";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

export type ParsedRacesResult = Omit<Result, "createdAt"> & {
  createdAt: string;
};

export async function getFirstRaceBadge() {
  const user = await getCurrentUser();

  if (!user) {
    return undefined;
  }

  const firstRaceAchievement = achievements.find(
    (achievement) => achievement.type === "FIRST_RACE"
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

export async function getFifthRaceBadge() {
  const user = await getCurrentUser();

  if (!user) {
    return undefined;
  }

  const fifthRaceAchievement = achievements.find(
    (achievement) => achievement.type === "FIFTH_RACE"
  );

  const resultsCount = await prisma.result.count({
    where: {
      userId: user.id,
    },
  });

  const fifthRaceBadge = await prisma.achievement.findFirst({
    where: {
      achievementType: "FIFTH_RACE",
      userId: user.id,
    },
  });

  if (!fifthRaceBadge && resultsCount >= 5) {
    await prisma.achievement.create({
      data: {
        achievementType: "FIFTH_RACE",
        userId: user.id,
      },
    });
    return fifthRaceAchievement;
  }
}

export async function getUserResultsForSnippet(
  snippetId: string,
  numberOfResults = 7
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

export async function getSnippetVote(snippetId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return await prisma.snippetVote.findUnique({
    where: {
      userId_snippetId: {
        userId: user.id,
        snippetId,
      },
    },
  });
}

export const getTopTen = safeLoader({
  outputValidation: z
    .object({
      id: z.string(),
      accuracy: z.number(),
      cpm: z.number(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        averageAccuracy: z.number(),
        averageCpm: z.number(),
        image: z.string(),
      }),
    })
    .array(),
  loader: async (snippet: string | undefined) => {
    const results = await prisma.result.findMany({
      where: {
        snippetId: snippet,
      },
      orderBy: {
        cpm: "desc",
      },
      take: 10,
      distinct: ["userId"],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            averageAccuracy: true,
            averageCpm: true,
            image: true,
          },
        },
      },
    });

    return convertDecimalsToNumbers(results);
  },
});

export async function getUserSnippetPlacement(snippetId?: Snippet["id"]) {
  const user = await getCurrentUser();

  if (!user) return null;

  const allResults = await prisma.result.findMany({
    where: {
      snippetId,
    },
    orderBy: {
      cpm: "desc",
    },
  });

  const usersResult = await prisma.result.findFirst({
    where: {
      snippetId,
      userId: user.id,
    },
    orderBy: {
      cpm: "desc",
    },
  });

  if (!usersResult) return null;

  return allResults.findIndex((r) => r.id === usersResult.id) + 1;
}


export const getFastestRace = async (snippetId: any, raceID: string) => {
  const user = await getCurrentUser();

  if (!user) return null;

  return await prisma.result.findFirst({
    where: {
      userId: user.id,
      snippetId: snippetId.snippetId,
      NOT: {
        id: raceID,
      }
    },
    orderBy: {
      cpm: "desc",
    },
  });
};

export const getBestAccuracy = async (snippetId: any, raceID: string) => {

  const user = await getCurrentUser();

  if (!user) return null;

  return await prisma.result.findFirst({
    where: {
      userId: user.id,
      snippetId: snippetId.snippetId,
      NOT: {
        id: raceID,
      }
    },
    orderBy: {
      accuracy: "desc",
    },
  });
};