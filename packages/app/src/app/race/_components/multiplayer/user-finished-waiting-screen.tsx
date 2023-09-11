"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";

type Props = {
  roomID: string;
}

const UserFinishedWaitingScreen: React.FC<Props> = React.memo(({ roomID }) => {
  const [allPlayers, setAllPlayers] = React.useState([])

  return (
    <React.Fragment>
      <header className="pb-8">
        <Heading
          typeOfHeading="h2"
          size="h2"
          title="Good job!"
          description="You have finished this race. Below are the realtime results of the race."
        />
      </header>


    </React.Fragment>
  );
});

UserFinishedWaitingScreen.displayName = "UserFinishedWaitingScreen";
export default UserFinishedWaitingScreen;