import { type Language } from "@code-racer/app/src/config/languages";
import { getRandomSnippet } from "@code-racer/app/src/app/race/(play)/loaders";
import { siteConfig } from "@code-racer/app/src/config/site";
import {
  type Prisma,
  prisma,
  type Race,
  type User,
  Snippet,
} from "@code-racer/app/src/lib/prisma";

/**For logged in user, we choose race if:
 * 1. its selected language is the same
 * 2. hasn't started or ended yet
 * 3. all participants are logged in user
 * 4. race's participants has not reached maxiumun capacity
 * TODO: 5. participants stats most suitable to current user
 * For guest user, we choose race if:
 * 1. its selected language is the same
 * 2. hasn't started or ended yet
 * 3. all participants are guest user
 * 4. race's participants has not reached maxiumum capacity
 */
export async function getAvailableRace(snippet: Snippet, userId?: User["id"]) {
  let availableRace = await prisma.race.findMany({
    where: {
      snippet: {
        language: snippet.language,
      },
      AND: [{ startedAt: null }, { endedAt: null }],
      participants: {
        every: {
          user: userId
            ? {
                isNot: null,
              }
            : null,
        },
      },
    },
    include: {
      participants: Boolean(userId),
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
      race._count.participants < siteConfig.multiplayer.maxParticipantsPerRace,
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

  return race;
}

export async function getRaceParticipant(
  raceToJoin: Prisma.RaceGetPayload<Record<string, never>>,
  userId?: User["id"],
) {
  return await prisma.raceParticipant.create({
    data: {
      user: userId
        ? {
            connect: {
              id: userId,
            },
          }
        : undefined,
      Race: {
        connect: {
          id: raceToJoin.id,
        },
      },
    },
  });
}

export async function raceMatchMaking(
  language: Language,
  userId?: User["id"],
): Promise<{ race: Race; snippet: Snippet; raceParticipantId: string }> {
  const snippet = await getRandomSnippet({ language });
  const race = await getAvailableRace(snippet, userId);
  const raceParticipant = await getRaceParticipant(race, userId);
  return {
    race,
    snippet,
    raceParticipantId: raceParticipant.id,
  };
}
