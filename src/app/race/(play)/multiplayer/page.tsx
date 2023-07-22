import { getCurrentUser } from "@/lib/session";

import { type RaceParticipant, type Race as RaceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import NoSnippet from "../../no-snippet";
import Race from "../../race";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

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

  let raceToJoin: RaceType;
  let participantId: RaceParticipant["id"];

  //Fetch available races and join one. if there none, create one.

  const races = await prisma.race.findMany({
    where: {
      startedAt: null,
      endedAt: null,
      snippet: {
        language: language,
      },
    },
  });

  if (races.length === 0) {
    raceToJoin = await prisma.race.create({
      data: {
        snippet: {
          connect: {
            id: snippet.id,
          },
        },
      },
    });
  } else {
    raceToJoin = races[Math.floor(Math.random() * races.length)]!;
  }

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
          id: raceToJoin.id,
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
