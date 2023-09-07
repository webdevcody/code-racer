"use client";

import type { RoomProps } from "../rooms/renderer";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { connectToSocket, socket } from "@/lib/socket";
import { Input } from "@/components/ui/input";
import { FALLBACK_IMG, RANDOM_USERNAME } from "@/config/consts";

export const JoinRoomForm: React.FC<RoomProps> = React.memo(({ session }) => {
  const [roomID, setRoomID] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomID) {
      setError("Please pass in a Room ID to join.");
      return;
    }
    setIsLoading(true);
    if (!socket.connected) {
      connectToSocket({
        userID: session?.id,
        displayName: session?.name ?? RANDOM_USERNAME,
        displayImage: session?.image ?? FALLBACK_IMG
      });
    }
    setIsLoading(true);
    socket.emit("CheckIfRoomIDExists", roomID);
    setRoomID("");
  };

  React.useEffect(() => {
    const handleRoomCreation = (roomID: string) => {
      setIsLoading(false);
      router.replace(`?roomID=${encodeURIComponent(roomID)}`);
    }

    socket.on("SendRoomID", handleRoomCreation);
    return () => {
      socket.off("SendRoomID", handleRoomCreation);
    }
  }, [router]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <label htmlFor="roomid-input" className="sr-only">Room ID</label>
      <Input
        aria-label="Room ID"
        title="Room ID"
        placeholder="Enter the ID of the room you'd like to join."
        value={roomID}
        onChange={(e) => setRoomID(e.target.value)}
      />
      <Button type="submit" className="mt-2 w-full">
        {isLoading ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : ("Join room")}
      </Button>
      {error && (
        <p className="text-destructive">{error}</p>
      )}
    </form>
  );
});

JoinRoomForm.displayName = "JoinRoomForm";