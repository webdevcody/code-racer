"use client";

import { Language } from "@/config/languages";
import React, { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

// Types
import type { User } from "next-auth";
import { Prisma } from "@prisma/client";
import { RaceStatus } from "@code-racer/wss/src/consts"; 
import { GameStateUpdatePayload } from "@code-racer/wss/src/events/server-to-client";

import GameMultiplayer from "@/app/race/_components/race/game-multiplayer";
import { MultiplayerLoadingLobby } from "../../_components/multiplayer-loading-lobby";
import type { Participant } from "@code-racer/wss/src/store/memory";

export default function RaceMultiplayerRoom({
  user,
  language,
}: {
  user?: User;
  language: Language;
}) {
  const [race, setRace] = React.useState<Prisma.RaceGetPayload<
    Record<string, never>
  > | null>(null);
  const [raceParticipantId, setRaceParticipantId] = React.useState<string>("");
  const [raceStatus, setRaceStatus] = React.useState<RaceStatus | null>(null);
  const [raceStartCountdown, setRaceStartCountdown] = useState<number>(0);

  const [participants, setParticipants] = React.useState<Array<Participant>>([]);

  // Connection to wss
  useEffect(() => {
    socket.emit("UserGetRace", {
      language,
      userId: user?.id,
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    socket.on("UserRaceResponse", (payload) => {
      setRace(payload.race);
      setParticipants(payload.participants);
      setRaceStatus(payload.raceStatus);
      setRaceParticipantId(payload.raceParticipantId);
    });

    socket.on("GameStateUpdate", (payload) => {
      setParticipants(payload.raceState.participants);
      setRaceStatus(payload.raceState.status);
      setRaceStartCountdown(payload.raceState.countdown ?? 0);
    });
  });

  return (
    <>
      {race && raceStatus !== "running" && (
        <MultiplayerLoadingLobby participants={participants}>
          {raceStatus === "waiting" && (
            <div className="flex flex-col items-center text-2xl font-bold">
              <div className="w-8 h-8 border-4 border-t-4 rounded-full border-muted-foreground border-t-warning animate-spin"></div>
              Waiting for players
            </div>
          )}
          {raceStatus === "countdown" && Boolean(raceStartCountdown) && (
            <div className="text-2xl font-bold text-center">
              Game starting in: {raceStartCountdown}
            </div>
          )}
        </MultiplayerLoadingLobby>
      )}

      {race &&
        raceParticipantId &&
        (raceStatus === "running" || "finished") && (
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
