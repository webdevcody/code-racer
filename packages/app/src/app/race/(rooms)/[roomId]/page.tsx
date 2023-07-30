"use client";

import * as React from "react";

import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { getSnippetById } from "../../(play)/loaders";
import { toast } from "@/components/ui/use-toast";
import { Snippet } from "@prisma/client";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const [snippet, setSnippet] = React.useState<Snippet | null>(null);
  const [raceId, setRaceId] = React.useState<string | null>(null);
  const [participantId, setParticipantId] = React.useState<string | null>(null);

  // Connection to wss
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("UserRoomRaceRequest", {
        raceId: params.roomId,
      });
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    socket.on("UserRoomRaceResponse", async (payload) => {
      const { race } = payload;
      const snippet = await getSnippetById(race.snippetId);
      if (!snippet) {
        return toast({
          title: "Error",
          description: "Snippet not found",
        });
      }

      setSnippet(snippet);
      setRaceId(race.id);
      setParticipantId(raceParticipantId);
    });
  });

  return (
    <div>
      <span>{params.roomId} room page</span>
      {JSON.stringify(snippet)}
    </div>
  );
}
