import { getCurrentUser } from "@/lib/session";

import { type RaceParticipant, type Race as RaceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import NoSnippet from "../../no-snippet";
import Race from "../../race";
import { redirect } from "next/navigation";
import { type Snippet, type User } from "@prisma/client";

export const dynamic = "force-dynamic";

// This function will find race that is most suitable to user
async function raceMatchMaking(snippet: Snippet, userId?: User["id"]): Promise<RaceType> {
  console.log("raceMatchMaking invoked");
  const races = await prisma.race.findMany({
      where: {
        snippet: {
          language: snippet.language
        }
    },
    include: {
      participants: true
    }
  });

  if (races.length < 1) {
    // There is no existing race, we create a new one
    return await prisma.race.create({
      data: {
        snippet: {
          connect: {
            id: snippet.id
          }
        }
      }
    });
  }
  
  if (!userId) {
    // If user is a GUEST user, we choose:
    // Race which its participant is also a guest user
    const guestOnlyRaces = races.filter((race) => !(race.participants[0].userId));

    if (guestOnlyRaces.length > 0) {
      return guestOnlyRaces[0];
    }
  }
  else {
    // If user is LOGGED IN, we choose:
    // Race which its participant has similar stats on race's snippet
    const loggedInUserRaces = races.filter((race) => race.participants[0].userId && race.participants[0].userId !== userId);
    if (loggedInUserRaces.length > 0) {
      return loggedInUserRaces[0];
    }
  }

  // Failed to find suitable race, then we create one
  return await prisma.race.create({
      data: {
        snippet: {
          connect: {
            id: snippet.id
          }
        }
      }
    });
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
