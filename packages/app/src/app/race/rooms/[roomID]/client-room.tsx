"use client";

import type { RoomProps } from "../page";

import React from "react";

import { useHandleRooms } from "../../_utils/useHandleRooms";
import dynamic from "next/dynamic";

const ListOfPlayers = dynamic(
  () => import("../../_components/multiplayer/list-of-players"),
  {
    ssr: false,
  }
);

const GameScreen = dynamic(
  () => import("../../_components/multiplayer/game-screen"),
  {
    ssr: false,
  }
);

type Props = {
  roomID: string;
} & RoomProps;

export const ClientRoom: React.FC<Props> = React.memo(({ session, roomID }) => {
  const { state, changeGameStatus, IS_PLAYER_CURRENT_USER } = useHandleRooms({
    session,
    roomID,
  });

  return (
    <div className="py-12 max-h-[60rem]">
      {!state.shouldRenderRoom && (
        <div>
          Verifying room ID... &#40;If the page stays like this for some time,
          please try refreshing the page. &#41;
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-12">
        {state.shouldRenderRoom && (
          <React.Fragment>
            <GameScreen
              roomID={roomID}
              amountOfPlayers={state.listOfPlayers.length}
              IS_PLAYER_CURRENT_USER={IS_PLAYER_CURRENT_USER}
              gameStatus={state.gameStatus}
              changeGameState={changeGameStatus}
              session={session}
            />
            <ListOfPlayers
              roomOwnerID={state.roomOwnerID}
              listOfPlayers={state.listOfPlayers}
              IS_PLAYER_CURRENT_USER={IS_PLAYER_CURRENT_USER}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
});

ClientRoom.displayName = "ClientRoom";
