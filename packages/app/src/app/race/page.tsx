import { Fragment } from "react";

import { Heading } from "@/components/ui/heading";

import PracticeRaceCard from "./_components/cards/practice-race-card";
import RaceRoomCard from "./_components/cards/race-room-card";

import { env } from "@/env.mjs";

export default function RacePage() {
  return (
    <main className="pt-12">
      <Heading
        typeOfHeading="h1"
        title="Choose a Race Mode"
        description="Practice your typing skills by yourself, with friends, or with other devs online"
        centered
      />
      <div className="grid grid-cols-1 gap-8 my-10 lg:grid-cols-3">
        <PracticeRaceCard />
        {env.NODE_ENV === "development" ? (
          <Fragment>
            <RaceRoomCard />
          </Fragment>
        ) : undefined}
      </div>
    </main>
  );
}
