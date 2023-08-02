"use client";

import * as React from "react";

import { Prisma } from "@/lib/prisma";
import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { type RaceStatus, raceStatus } from "@code-racer/wss/src/types";
import { User } from "next-auth";
import MultiplayerLoadingLobby from "@/app/race/_components/multiplayer-loading-lobby";
import { Button } from "@/components/ui/button";

import { GameStateUpdatePayload } from "@code-racer/wss/src/events/server-to-client";
import GameMultiplayer from "../../_components/race/game-multiplayer";

type Participant = Omit<
  GameStateUpdatePayload["raceState"]["participants"][number],
  "socketId"
>;

export function Room({ user, roomId }: { user: User; roomId: string }) {
  const [race, setRace] = React.useState<Prisma.RaceGetPayload<
    Record<string, never>
  > | null>(null);
  const [raceParticipantId, setRaceParticipantId] = React.useState<string>("");
  const [raceStatus, setRaceStatus] = React.useState<RaceStatus | null>(null);
  const [raceStartCountdown, setRaceStartCountdown] = React.useState<number>(0);

  const [participants, setParticipants] = React.useState<Participant[]>([]);
  useEffect(() => {
    socket.emit("UserJoinRoom", {
      userId: user.id,
      raceId: roomId,
    });

    socket.on("RoomJoined", async (payload) => {
      const { race, participants, raceStatus } = payload;

      setRace(race);
      setParticipants(participants);
      setRaceStatus(raceStatus);
      setRaceParticipantId(raceParticipantId);
    });

    socket.on("UpdateParticipants", async (payload) => {
      setParticipants(payload.participants);
    });

    socket.on("GameStateUpdate", (payload) => {
      console.log(payload.raceState.participants);

      setParticipants(payload.raceState.participants);
      setRaceStatus(payload.raceState.status);
      setRaceStartCountdown(payload.raceState.countdown ?? 0);
    });

    return () => {
      socket.emit("UserLeaveRoom", { raceId: roomId, userId: user.id });
      // socket.disconnect();
      // socket.off("connect");
    };
  }, []);

  function handleGameStart() {
    socket.emit("StartRaceCountdown", { raceId: roomId });
  }

  const notStarted = raceStatus === "waiting" || raceStatus === "countdown";

  console.log(participants, raceStatus);

  return (
    <>
      {participants && notStarted && (
        <MultiplayerLoadingLobby participants={participants}>
          <Button onClick={handleGameStart}>Start game</Button>
          {raceStatus === "countdown" && Boolean(raceStartCountdown) && (
            <div className="text-2xl font-bold text-center">
              Game starting in: {raceStartCountdown}
            </div>
          )}
        </MultiplayerLoadingLobby>
      )}

      {race && participants && !notStarted && (
        <GameMultiplayer
          race={race}
          participants={participants}
          currentRaceStatus={raceStatus}
          raceId={race.id}
          participantId={raceParticipantId}
          user={user}
        />
      )}
    </>
  );
}
