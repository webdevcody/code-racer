import { getCurrentUser } from "@/lib/session";

import { type RaceParticipant, type Race as RaceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import NoSnippet from "../../no-snippet";
import Race from "../../race";
import { redirect } from "next/navigation";
import { type Snippet, type User } from "@prisma/client";
import { siteConfig } from "@/config/site";
import { raceMatchMaking } from "./loaders";
import { getRandomSnippet } from "../loaders";
import { createRaceParticipant } from "./actions";

export const dynamic = "force-dynamic";

// This function will find race that is most suitable to user

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
  const snippet = await getRandomSnippet({ language: searchParams.lang });
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

  const participant = await createRaceParticipant(raceToJoin, user);

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
