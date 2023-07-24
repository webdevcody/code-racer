import { getCurrentUser } from "@/lib/session";

import { type RaceParticipant, type Race as RaceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import NoSnippet from "../../no-snippet";
import Race from "../../race";
import { redirect } from "next/navigation";
import { type Snippet, type User } from "@prisma/client";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

// This function will find race that is most suitable to user
async function raceMatchMaking(
  snippet: Snippet,
  userId?: User["id"],
): Promise<RaceType> {
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
    // console.log("Picked race", race);
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
    // console.log("Picked race", race);
    return race;
  }
}

async function getRandomSnippet(lang: string) {
  const itemCount = await prisma.snippet.count({
    where: {
      onReview: false,
      language: lang,
    },
  });
  const skip = Math.max(0, Math.floor(Math.random() * itemCount));
  const [snippet] = await prisma.snippet.findMany({
    where: {
      onReview: false,
      language: lang,
    },
    take: 1,
    skip: skip,
  });
  return snippet;
}

export default async function MultiplayerRacePage({
  searchParams,
}: {
  searchParams: {
    lang: string;
  };
}) {
  if (!searchParams.lang) {
    redirect("/race");
  }
  const user = await getCurrentUser();
  const snippet = await getRandomSnippet(searchParams.lang);
  const language = searchParams.lang;

  if (!snippet) {
    return (
      <main className="flex flex-col items-center justify-between py-10 lg:p-24">
        <NoSnippet
          message={"Looks like there is no snippet available yet. Create one?"}
          language={language}
        />
      </main>
    );
  }

  let raceToJoin: RaceType | null = null;
  let participantId: RaceParticipant["id"];

  //Fetch available races and join one. if there none, create one.
  raceToJoin = await raceMatchMaking(snippet, user?.id);

  const participant = await prisma.raceParticipant.create({
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

  return (
    <main className="flex flex-col items-center justify-between py-10 lg:p-24">
      <Race
        snippet={snippet}
        user={user}
        raceId={raceToJoin?.id}
        participantId={participant.id}
      />
    </main>
  );
}
