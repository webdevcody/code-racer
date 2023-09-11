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
  ssr: false
});

type Props = {
  roomID: string;
  amountOfPlayers: number;
  gameStatus: RaceStatus;
  IS_PLAYER_CURRENT_USER: boolean;
  changeGameState: (_status: RaceStatus) => void;
} & RoomProps;

const GameScreen: React.FC<Props> = React.memo(
  ({
    roomID,
    session,
    amountOfPlayers,
    gameStatus,
    IS_PLAYER_CURRENT_USER,
    changeGameState,
  }) => {
    return (
      <div className="md:w-[65%] lg:-[75%] dark:border-2 min-h-[10rem] rounded-lg shadow-md shadow-black/20 p-4">
        {gameStatus === RACE_STATUS.WAITING && (
          <WaitingScreen
            roomID={roomID}
            amountOfPlayers={amountOfPlayers}
            IS_PLAYER_CURRENT_USER={IS_PLAYER_CURRENT_USER}
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
          <FinishedScreen roomID={roomID} changeGameState={changeGameState} />
        )}
      </div>
    );
  }
);

GameScreen.displayName = "GameScreen";
export default GameScreen;
