"use client";
import type { GameFinishedPayload } from "@code-racer/wss/src/events/server-to-client";
import type { RaceStatus } from "@code-racer/wss/src/consts";

import React from "react";

import { socket } from "@/lib/socket";

type Props = {
  roomID: string;
  changeGameState: (_status: RaceStatus) => void;
}

const FinishedScreen: React.FC<Props> = React.memo(({
  roomID,
  changeGameState
}) => {
  const [gameFinishedDetails, setGameFinishedDetail] = React.useState<GameFinishedPayload>();

  const handleGameFinished = React.useCallback((payload: GameFinishedPayload) => {
    setGameFinishedDetail(payload);
  }, []);

  React.useEffect(() => {
    socket.on("GameFinished", handleGameFinished);
    return () => {
      socket.off("GameFinished", handleGameFinished);
    };
  }, [handleGameFinished]);

  return (
    <React.Fragment>
      The has finished! Hooray!
    </React.Fragment>
  );
});

FinishedScreen.displayName = "FinishedScreen";
export default FinishedScreen;