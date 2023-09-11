import type { NextPage } from "next";

import { Fragment } from "react";

import { ClientRoom } from "./client-room";

import { getCurrentUser } from "@/lib/session";

import { Heading } from "@/components/ui/heading";

import { siteConfig } from "@/config/site";

type Props = {
  params: {
    roomID: string;
  };
};

const PlayRoom: NextPage<Props> = async ({ params: { roomID } }) => {
  const userSession = await getCurrentUser();

  const session = {
    id: userSession?.id,
    name: userSession?.name,
    image: userSession?.image,
  };

  return (
    <Fragment>
      {process.env.NODE_ENV === "development" && (
        <Fragment>
          <header className="pt-4">
            <Heading
              title="Get Racing!"
              description="Welcome to the racing room! Happy racing!"
            />
          </header>
          <main className="min-h-[40rem]">
            <ClientRoom session={session} roomID={roomID} />
            <div className="pb-12">
              <Heading typeOfHeading="h3" size="h3" title="Rules & Mechanics:" />
              <ol className="flex flex-col gap-4 pt-6 list-decimal pl-4">
                <li>
                  If you are the only player in this room and you leave, then this
                  room will be removed.
                </li>
                <li>
                  If you leave and you are the owner of this room, the player who
                  came after you will be the new owner.
                </li>
                <li>
                  Players cannot join this room if the following conditions are met:
                  <ol className="pt-2 flex flex-col gap-2 list-disc pl-8">
                    <li>
                      There are {siteConfig.multiplayer.maxParticipantsPerRace}{" "}
                      players.
                    </li>
                    <li>The race has started.</li>
                  </ol>
                </li>
                <li>
                  If you are a logged in player, this race will be saved on your
                  account once it has finished. If you leave before the race is
                  finished, then the data for this race will not be saved.
                </li>
                <li>Have fun and happy racing!</li>
              </ol>
            </div>
          </main>
        </Fragment>
      )}

      {process.env.NODE_ENV !== "development" && (
        <div>Currently being fixed...</div>
      )}
    </Fragment>
  );
};

export default PlayRoom;
