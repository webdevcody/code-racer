"use client";

import * as React from "react";

import { Prisma } from "@/lib/prisma";
import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { getSnippetById } from "../../(play)/loaders";
import { toast } from "@/components/ui/use-toast";
import { Snippet } from "@prisma/client";
import { User } from "next-auth";
import MultiplayerLoadingLobby from "@/app/race/_components/multiplayer-loading-lobby";
import { Button } from "@/components/ui/button";

export function Room({ user, roomId }: { user: User; roomId: string }) {
  const [snippet, setSnippet] = React.useState<Snippet | null>(null);
  const [race, setRace] = React.useState<Prisma.RaceGetPayload<{
    include: { participants: true };
  }> | null>(null);
  const [participants, setParticipants] = React.useState<
    Prisma.RaceParticipantGetPayload<Record<string, never>>[] | null
  >(null);

  useEffect(() => {
    // socket.

    socket.emit("UserJoinRoom", {
      userId: user.id,
      raceId: roomId,
    });

    socket.on("RoomJoined", async (payload) => {
      const { race } = payload;
      const snippet = await getSnippetById(race.snippetId);
      if (!snippet) {
        return toast({
          title: "Error",
          description: "Snippet not found",
        });
      }

      setSnippet(snippet);
      setRace(race);
      setParticipants(race.participants);

      socket.on("UpdateParticipants", async (payload) => {
        console.log("updating participants");
        setParticipants(payload.participants);
      });
    });

    // socket.on("UpdateParticipants", async (payload) => {
    //   console.log("updating participants")
    //   setParticipants(payload.participants);
    // });

    return () => {
      socket.emit("UserLeaveRoom", { raceId: roomId, userId: user.id });
      // socket.disconnect();
      // socket.off("connect");
    };
  }, []);

  function handleGameStart() {
    // socket.emit("StartRaceCountdown", {});
  }

  return (
    <div>
      {JSON.stringify(race)}
      {participants && (
        <MultiplayerLoadingLobby participants={participants}>
          <Button onClick={handleGameStart}>Start game</Button>
        </MultiplayerLoadingLobby>
      )}
    </div>
  );
}
