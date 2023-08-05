import { type Language } from "@code-racer/app/src/config/languages";
import { getRandomSnippet } from "@code-racer/app/src/app/race/(play)/loaders";
import { siteConfig } from "@code-racer/app/src/config/site";
import {
  type Prisma,
  prisma,
  type User,
  Snippet,
  type Race,
} from "@code-racer/app/src/lib/prisma";

type RaceAverageStatsWeight = number;

/**For logged in user, we choose race if:
 *  1. its selected language is the same
 *  2. hasn't started or ended yet
 *  3. all participants are logged in user
 *  4. race's participants has not reached maxiumun capacity
 *  5. participants stats most suitable to current user
 * For guest user, we choose race if:
 *  1. its selected language is the same
 *  2. hasn't started or ended yet
 *  3. all participants are guest user
 *  4. race's participants has not reached maxiumum capacity
 */
export async function getAvailableRace(
  language: Language,
  userId?: User["id"],
) {
  let availableRace = await prisma.race.findMany({
    where: {
      snippet: {
        language,
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

  if (availableRace.length < 1) {
    const randomSnippet = await getRandomSnippet({ language });
    const race = await createRace(randomSnippet);
    // console.log("Selected", race);
    return race;
  }

  if (userId) {
    /*
      Current Implementation match user base on a value called `stats weight` by averaging both `averageCpm` and `averageAccuary`
      Then we compare user's stats weight to every race's stats weight
      We pick race which has the least deviation value (smallest delta value)
    */
    let currentSelectedRace = availableRace[0];

    const userStatsWeight = await getUserStatsWeight(userId);

    const currentRaceStatsWeight = await getRaceStatsWeight(
      currentSelectedRace.id,
    );

    let delta = Math.abs(userStatsWeight - currentRaceStatsWeight);

    availableRace.forEach(async (race, index) => {
      const raceStatsWeight = await getRaceStatsWeight(race.id);
      if (userStatsWeight - raceStatsWeight < delta) {
        currentSelectedRace = availableRace[index];
        delta = userStatsWeight - raceStatsWeight;
      }
    });

    // For Debugging
    // console.log({
    //   userStatsWeight,
    //   currentRaceStatsWeight,
    //   currentDelta: delta,
    //   currentSelectedRace,
    // });
    return currentSelectedRace;
  }
  // console.log("Selected", availableRace[0]);
  return availableRace[0];
}

export async function createRace(snippet: Snippet, id?: string) {
  let data: { snippet: { connect: { id: string } }; id?: string } = {
    snippet: {
      connect: {
        id: snippet.id,
      },
    },
  };

  if (id) {
    data = {
      ...data,
      id,
    };
  }

  return await prisma.race.create({
    data,
  });
}

export async function createRaceParticipant(
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

export async function raceMatchMaking(language: Language, userId?: User["id"]) {
  const race = await getAvailableRace(language, userId);
  const raceParticipant = await createRaceParticipant(race, userId);
  return {
    race,
    raceParticipantId: raceParticipant.id,
  };
}

async function getRaceStatsWeight(
  raceId: Race["id"],
): Promise<RaceAverageStatsWeight> {
  const participantsAverageStats = await prisma.user.aggregate({
    _avg: {
      averageAccuracy: true,
      averageCpm: true,
    },
    where: {
      RaceParticipant: {
        some: {
          raceId: raceId,
        },
      },
    },
  });

  // console.log("participantsAverageStats", participantsAverageStats);

  const weight =
    Number(participantsAverageStats._avg.averageAccuracy) +
    Number(participantsAverageStats._avg.averageCpm) / 2;

  return weight;
}

async function getUserStatsWeight(userId: User["id"]): Promise<number> {
  const user = await prisma.user.findFirst({
    select: {
      averageAccuracy: true,
      averageCpm: true,
    },
    where: {
      id: userId,
    },
  });

  const userStatsWeight =
    Number(user?.averageAccuracy) + Number(user?.averageCpm) / 2;

  return userStatsWeight;
}
