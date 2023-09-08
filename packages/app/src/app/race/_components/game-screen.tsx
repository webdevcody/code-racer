"use client";

import { RACE_STATUS, type RaceStatus } from "@code-racer/wss/src/consts";
import type { RoomProps } from "../rooms/page";

import React from "react";
import dynamic from "next/dynamic";

import { socket } from "@/lib/socket";

import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";

const CountdownScreen = dynamic(() => import("./countdown-screen"));

type Props = {
  roomID: string;
  roomOwnerID: string;
  amountOfPlayers: number;
} & RoomProps;

type WaitingScreenProps = {
  roomID: string;
  amountOfPlayers: number;
  IS_PLAYER_CURRENT_USER: boolean;
}

export const GameScreen: React.FC<Props> = React.memo(({
  session,
  roomID,
  amountOfPlayers,
  roomOwnerID
}) => {
  const [gameState, setGameState] = React.useState<RaceStatus | undefined>();

  const IS_PLAYER_CURRENT_USER = session?.id === roomOwnerID || socket.id === roomOwnerID;

  React.useEffect(() => {
    if (roomID) {
      socket.emit("CheckGameStatusOfRoom", roomID);
    }

    const handleGameStatusResponse = (status: RaceStatus) => {
      setGameState(status);
    }

    socket.on("SendGameStatusOfRoom", handleGameStatusResponse);
    return () => {
      socket.off("SendGameStatusOfRoom", handleGameStatusResponse);
    };
  }, [roomID]);

  React.useEffect(() => {
    const GAME_STARTED_AND_PLAYERS_LEFT_WITH_ONE_PLAYER_REMAINING = amountOfPlayers <= 1 && (gameState && gameState !== "waiting") && roomID;
    
    if (GAME_STARTED_AND_PLAYERS_LEFT_WITH_ONE_PLAYER_REMAINING) {
      /** Reset the game */
      socket.emit("ChangeGameStatusOfRoom", {
        roomID,
        raceStatus: RACE_STATUS.WAITING
      });
    }
  }, [amountOfPlayers, gameState, roomID]);

  return (
    <div className="md:w-[65%] lg:-[75%] dark:border-2 min-h-[10rem] rounded-lg shadow-md shadow-black/20 p-4">
      {
        gameState === RACE_STATUS.WAITING
        && <WaitingScreen
          roomID={roomID}
          amountOfPlayers={amountOfPlayers}
          IS_PLAYER_CURRENT_USER={IS_PLAYER_CURRENT_USER}
        />
      }
      {
        gameState === RACE_STATUS.COUNTDOWN
        && <React.Suspense>
          <CountdownScreen roomID={roomID} />
        </React.Suspense>
      }

      {
        gameState === RACE_STATUS.RUNNING && (
          <span>The game has begun!</span>
        )
      }
    </div>
  );
});

const WaitingScreen: React.FC<WaitingScreenProps> = React.memo(({
  roomID,
  amountOfPlayers,
  IS_PLAYER_CURRENT_USER
}) => {

  return (
    <React.Fragment>
      <div className="mb-12">
        Room ID
        <div className="mt-2 flex justify-between items-center py-2 px-4 border-[1px] rounded-md bg-slate-200/20 dark:bg-black/20">
          {roomID}
          <CopyButton value={roomID} />
        </div>
      </div>

      {IS_PLAYER_CURRENT_USER && (
        <div>
          <span>You are the room owner of this room.</span>
          <Button
            className="mt-2 w-full"
            onClick={() => {
              socket.emit("ChangeGameStatusOfRoom", {
                roomID,
                raceStatus: RACE_STATUS.COUNTDOWN
              });
            }}
            disabled={amountOfPlayers < 2}
          >
            {amountOfPlayers > 1 ? ("Start Race") : ("This room must have more than one player.")}
          </Button>
        </div>
      )}

      {!IS_PLAYER_CURRENT_USER && (
        <div>Waiting for the room owner to start the race...</div>
      )}
    </React.Fragment>
  );
});

WaitingScreen.displayName = "WaitingScreen";
GameScreen.displayName = "GameScreen";