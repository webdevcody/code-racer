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
import { toast } from "@/components/ui/use-toast";
import CopyButton from "@/components/ui/copy-button";

type Participant = Omit<
  GameStateUpdatePayload["raceState"]["participants"][number],
  "socketId"
>;

export function Room({ user, roomId }: { user?: User; roomId: string }) {
  const [race, setRace] = React.useState<Prisma.RaceGetPayload<
    Record<string, never>
  > | null>(null);
  const [raceParticipantId, setRaceParticipantId] = React.useState<string>("");
  const [raceStatus, setRaceStatus] = React.useState<RaceStatus | null>(null);
  const [raceStartCountdown, setRaceStartCountdown] = React.useState<number>(0);

  const [participants, setParticipants] = React.useState<Participant[]>([]);

  const notStarted = raceStatus === "waiting" || raceStatus === "countdown";

  const isRoomLeader = raceParticipantId === participants[0]?.id;

  const canStartRace =
    isRoomLeader && participants.length > 1 && raceStatus === "waiting";

  useEffect(() => {
    socket.emit("UserJoinRoom", {
      userId: user?.id,
      raceId: roomId,
    });

    socket.on("RoomJoined", async (payload) => {
      const { race, participants, raceStatus, participantId } = payload;

      console.log(race, participants, notStarted);

      setRace(race);
      setParticipants(participants);
      setRaceStatus(raceStatus);
      setRaceParticipantId(participantId);
    });

    socket.on("UpdateParticipants", async (payload) => {
      setParticipants(payload.participants);
    });

    socket.on("GameStateUpdate", (payload) => {
      setParticipants(payload.raceState.participants);
      setRaceStatus(payload.raceState.status);
      setRaceStartCountdown(payload.raceState.countdown ?? 0);
    });

    socket.on("SendNotification", (payload) => {
      toast(payload);
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
    };
  }, []);

  function handleGameStart() {
    socket.emit("StartRaceCountdown", { raceId: roomId });
  }

  return (
    <>
      {participants && notStarted && (
        <MultiplayerLoadingLobby participants={participants}>
          <div className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground gap-2">
            <span>{roomId}</span>
            <CopyButton value={roomId} />
          </div>
          {isRoomLeader && (
            <Button onClick={handleGameStart} disabled={!canStartRace}>
              Start game
            </Button>
          )}
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
