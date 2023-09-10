"use client";

import type { ParticipantInformation } from "@code-racer/wss/src/store/types";

import React from "react";
import { CrownIcon } from "lucide-react";

import Image from "next/image";

import { Heading } from "@/components/ui/heading";

type Props = {
  listOfPlayers: Array<ParticipantInformation>;
  roomOwnerID: string;
  IS_PLAYER_CURRENT_USER: boolean;
}

const ListOfPlayers: React.FC<Props> = React.memo(
  ({ listOfPlayers, roomOwnerID, IS_PLAYER_CURRENT_USER }) => {
    return (
      <section className="md:w-[35%] lg:w-[25%] overflow-y-auto flex flex-col gap-4 dark:border-2 shadow-md shadow-black/20 p-4 rounded-lg">
        <Heading title="Players" size="h4" typeOfHeading="h2" />
        {listOfPlayers.map((player) => {
          return (
            <div key={player.userID} className="flex gap-2 items-center">
              <Image
                src={player.displayImage}
                alt={`${player.displayName}'s profile picture`}
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="flex gap-1 items-center flex-wrap">
                {player.userID === roomOwnerID && (
                  <CrownIcon className="w-4 h-4" />
                )}
                <span className="overflow-auto break-words whitespace-pre-wrap">
                  {player.displayName}&nbsp;
                  {IS_PLAYER_CURRENT_USER && "(You)"}
                </span>
              </span>
            </div>
          );
        })}
      </section>
    );
  }
);

ListOfPlayers.displayName = "ListOfPlayers";
export default ListOfPlayers;