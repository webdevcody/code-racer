"use server";
import { prisma } from "@/lib/prisma";
import type { Race } from "@prisma/client";
import { siteConfig } from "@/config/site";
import { Prisma } from "@prisma/client";
import { Snippet, User } from "@prisma/client";

export async function getRandomSnippet(input: {
  language: string;
  reportedSnippets?: string[];
}) {
  const itemCount = await prisma.snippet.count({
    where: {
      onReview: false,
      language: input.language,
      NOT: {
        id: {
          in: input.reportedSnippets ?? [],
        },
      },
    },
  });
  const skip =
    itemCount === 1 ? 0 : Math.max(0, Math.floor(Math.random() * itemCount));

  const [snippet] = await prisma.snippet.findMany({
    where: {
      onReview: false,
      language: input.language,
      NOT: {
        id: {
          in: input.reportedSnippets ?? [],
        },
      },
    },
    take: 1,
    skip,
  });

  return snippet;
}

export async function getSnippetById(snippetId: string) {
  return await prisma.snippet.findUnique({
    where: {
      id: snippetId,
    },
  });
}

export async function raceMatchMaking(
  snippet: Snippet,
  userId?: User["id"],
): Promise<Race> {
  if (userId) {
    // For logged in user, we choose race if:
    // 1. its snippet is the same
    // 2. hasn't started or ended yet
    // 3. all participants are logged in user
    // 4. race's participants has not reached maxiumun capacity
    // TODO: 5. participants stats most suitable to current user

    let availableRace = await prisma.race.findMany({
      where: {
        snippet: {
          language: snippet.language,
        },
        AND: [{ startedAt: null }, { endedAt: null }],
        participants: {
          every: {
            user: {
              isNot: null,
            },
          },
        },
      },
      include: {
        participants: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    // filter out full race
    availableRace = availableRace.filter(
      (race) =>
        race._count.participants <
        siteConfig.multiplayer.maxParticipantsPerRace,
    );

    // TODO: sort races based on participant stats most suitable to current user
    // for now we pick first one, if there isn't any create one instead
    const race =
      availableRace.length > 0
        ? availableRace[0]
        : await prisma.race.create({
            data: {
              snippet: {
                connect: {
                  id: snippet.id,
                },
              },
            },
          });
    console.log("Picked race", race);
    return race;
  } else {
    // For guest user, we choose race if:
    // 1. its snippet is the same
    // 2. hasn't started or ended yet
    // 3. all participants are guest user
    // 4. race's participants has not reached maxiumun capacity

    let availableRace = await prisma.race.findMany({
      where: {
        snippet: {
          language: snippet.language,
        },
        AND: [{ startedAt: null }, { endedAt: null }],
        participants: {
          every: {
            user: null,
          },
        },
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    // filter out full race
    availableRace = availableRace.filter(
      (race) =>
        race._count.participants <
        siteConfig.multiplayer.maxParticipantsPerRace,
    );

    // pick first one, if there isn't any create one instead
    const race =
      availableRace.length > 0
        ? availableRace[0]
        : await prisma.race.create({
            data: {
              snippet: {
                connect: {
                  id: snippet.id,
                },
              },
            },
          });
    console.log("Picked race", race);
    return race;
  }
}

export async function createRaceParticipant(
  raceToJoin: Prisma.RaceGetPayload<Record<string, never>>,
  user?: any,
) {
  return await prisma.raceParticipant.create({
    data: {
      user: user
        ? {
            connect: {
              id: user.id,
            },
          }
        : undefined,
      Race: {
        connect: {
          id: raceToJoin?.id,
        },
      },
    },
  });
}
