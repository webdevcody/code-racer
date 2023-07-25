import { getCurrentUser } from "@/lib/session";
import NoSnippet from "../../no-snippet";
import Race from "../../race";
import { redirect } from "next/navigation";
import { raceMatchMaking } from "./loaders";
import { getRandomSnippet } from "../loaders";
import { createRaceParticipant } from "./actions";

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

  const snippet = await getRandomSnippet({ language: searchParams.lang });
  if (!snippet) {
    return (
      <main className="flex flex-col items-center justify-between py-10 lg:p-24">
        <NoSnippet
          message={"Looks like there is no snippet available yet. Create one?"}
          language={searchParams.lang}
        />
      </main>
    );
  }

  const user = await getCurrentUser();
  const raceToJoin = await raceMatchMaking(snippet, user?.id);
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
