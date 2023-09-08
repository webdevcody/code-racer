"use client";

import type { ParticipantInformation } from "@code-racer/wss/src/new-game";
import type { RoomProps } from "../rooms/page";

import React from "react";

import Image from "next/image";

import { socket } from "@/lib/socket";
import { Heading } from "@/components/ui/heading";
import { CrownIcon } from "lucide-react";

type Props = {
  listOfPlayers: Array<ParticipantInformation>;
  roomOwnerID: string;
} & RoomProps;

export const ListOfPlayers: React.FC<Props> = React.memo(({
  listOfPlayers,
  roomOwnerID,
  session
}) => {

  return (
    <section className="md:w-[35%] lg:-[25%] overflow-y-auto flex flex-col gap-4 dark:border-2 shadow-md shadow-black/20 p-4 rounded-lg">
      <Heading title="Players" size="h4" typeOfHeading="h2" />
      {listOfPlayers.map((player) => {
        const IS_PLAYER_CURRENT_USER = session?.id === player.userID || socket.id === player.userID;
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
                {IS_PLAYER_CURRENT_USER && ("(You)")}
              </span>
            </span>
          </div>
        );
      })}
    </section>
  );
});

ListOfPlayers.displayName = "ListOfPlayers";