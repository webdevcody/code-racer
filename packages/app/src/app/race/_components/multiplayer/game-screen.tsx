"use client";

import { RACE_STATUS, type RaceStatus } from "@code-racer/wss/src/consts";
import type { RoomProps } from "../../rooms/page";

import React from "react";
import dynamic from "next/dynamic";

const CountdownScreen = dynamic(() => import("./countdown-screen"), {
  ssr: false,
});
const WaitingScreen = dynamic(() => import("./waiting-screen"), {
  ssr: false,
});
const RaceMultiplayerCard = dynamic(() => import("./race-multiplayer-card"), {
  ssr: false,
});
const FinishedScreen = dynamic(() => import("./finished-screen"), {
  ssr: false,
});

type Props = {
  roomID: string;
  amountOfPlayers: number;
  gameStatus: RaceStatus;
  IS_PLAYER_CURRENT_ROOM_OWNER: boolean;
  changeGameState: (_status: RaceStatus) => void;
} & RoomProps;

const GameScreen: React.FC<Props> = React.memo(
  ({
    roomID,
    session,
    amountOfPlayers,
    gameStatus,
    IS_PLAYER_CURRENT_ROOM_OWNER,
    changeGameState,
  }) => {
    return (
      <div className="lg:w-[65%] dark:border-2 min-h-[10rem] rounded-lg shadow-md shadow-black/20 p-4">
        {gameStatus === RACE_STATUS.WAITING && (
          <WaitingScreen
            roomID={roomID}
            amountOfPlayers={amountOfPlayers}
            IS_PLAYER_CURRENT_ROOM_OWNER={IS_PLAYER_CURRENT_ROOM_OWNER}
            changeGameState={changeGameState}
          />
        )}
        {gameStatus === RACE_STATUS.COUNTDOWN && (
          <CountdownScreen roomID={roomID} />
        )}
        {gameStatus === RACE_STATUS.RUNNING && (
          <RaceMultiplayerCard roomID={roomID} session={session} />
        )}
        {gameStatus === RACE_STATUS.FINISHED && (
          <FinishedScreen
            session={session}
            IS_PLAYER_CURRENT_OWNER={IS_PLAYER_CURRENT_ROOM_OWNER}
            changeGameState={changeGameState}
            roomID={roomID}
          />
        )}
      </div>
    );
  }
);

GameScreen.displayName = "GameScreen";
export default GameScreen;
