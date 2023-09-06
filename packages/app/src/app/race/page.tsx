import { Heading } from "@/components/ui/heading";
import PracticeRaceCard from "./_components/cards/practice-race-card";
import MultiplayerRaceCard from "./_components/cards/multiplayer-race-card";
import FriendsRaceCard from "./_components/cards/friends-race-card";
import { env } from "@/env.mjs";
import { Fragment } from "react";

export default function RacePage() {
  return (
    <main className="pt-12">
      <Heading
        title="Choose a Race Mode"
        description="Practice your typing skills by yourself, with friends, or with other devs online"
        centered
      />
      <div className="grid grid-cols-1 gap-8 my-10 lg:grid-cols-3">
        <PracticeRaceCard />
        {env.NODE_ENV === "development" ? (
          <Fragment>
            <MultiplayerRaceCard enabled={env.MULTIPLAYER} />
            <FriendsRaceCard enabled={env.MULTIPLAYER} />
          </Fragment>
        ) : undefined}

      </div>
    </main>
  );
}
