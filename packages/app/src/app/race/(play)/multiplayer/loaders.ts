import type { RaceParticipant, Race } from "@prisma/client";

import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { Snippet, User } from "@prisma/client";

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
