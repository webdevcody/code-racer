"use client";

import { RACE_STATUS, type RaceStatus } from "@code-racer/wss/src/consts";
import type { RoomProps } from "../../rooms/page";

import React from "react";
import dynamic from "next/dynamic";

import { socket } from "@/lib/socket";

const CountdownScreen = dynamic(() => import("./countdown-screen"), {
  ssr: false
});
const WaitingScreen = dynamic(() => import("./waiting-screen"), {
  ssr: false
});
const RaceMultiplayerCard = dynamic(() => import("./race-multiplayer-card"), {
  ssr: false
});

type Props = {
  roomID: string;
  roomOwnerID: string;
  amountOfPlayers: number;
} & RoomProps;

/** TODO
 *  ---
 *  1. Separate logics
 *  2. use hook named useReducer (just like in race practice)
 */
export const GameScreen: React.FC<Props> = React.memo(
  ({ session, roomID, amountOfPlayers, roomOwnerID }) => {
    const [gameState, setGameState] = React.useState<RaceStatus | undefined>();

    const IS_PLAYER_CURRENT_USER = React.useMemo(() =>
      session?.id === roomOwnerID || socket.id === roomOwnerID,
      [session?.id, roomOwnerID]
    );

    const handleChangeGameState = React.useCallback((status: RaceStatus) => {
      socket.emit("ChangeGameStatusOfRoom", {
        roomID,
        raceStatus: status,
      });
    }, [roomID]);

    React.useEffect(() => {
      if (roomID) {
        socket.emit("CheckGameStatusOfRoom", roomID);
      }
      const handleGameStatusResponse = (status: RaceStatus) => {
        setGameState(status);
      };
      socket.on("SendGameStatusOfRoom", handleGameStatusResponse);
      return () => {
        socket.off("SendGameStatusOfRoom", handleGameStatusResponse);
      };
    }, [roomID]);

    React.useEffect(() => {
      const GAME_STARTED_AND_PLAYERS_LEFT_WITH_ONE_PLAYER_REMAINING =
        amountOfPlayers <= 1 && gameState && gameState !== "waiting" && roomID;

      if (GAME_STARTED_AND_PLAYERS_LEFT_WITH_ONE_PLAYER_REMAINING) {
        handleChangeGameState(RACE_STATUS.WAITING);
      }
    }, [handleChangeGameState, amountOfPlayers, gameState, roomID]);

    return (
      <div className="md:w-[65%] lg:-[75%] dark:border-2 min-h-[10rem] rounded-lg shadow-md shadow-black/20 p-4">
        {gameState === RACE_STATUS.WAITING && (
          <WaitingScreen
            roomID={roomID}
            amountOfPlayers={amountOfPlayers}
            IS_PLAYER_CURRENT_USER={IS_PLAYER_CURRENT_USER}
            handleChangeGameState={handleChangeGameState}
          />
        )}
        {gameState === RACE_STATUS.COUNTDOWN && <CountdownScreen roomID={roomID} />}
        {gameState === RACE_STATUS.RUNNING && <RaceMultiplayerCard roomID={roomID} session={session} />}
      </div>
    );
  }
);

GameScreen.displayName = "GameScreen";
