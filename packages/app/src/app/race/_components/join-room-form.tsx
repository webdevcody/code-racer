"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const JoinRoomForm: React.FC = React.memo(() => {
  const [roomID, setRoomID] = React.useState("");
  const [error, setError] = React.useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomID) {
      setError("Please pass in a Room ID to join.");
      return;
    }
    router.push(`/race/rooms/${encodeURIComponent(roomID)}`);
    setRoomID("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label htmlFor="roomid-input" className="sr-only">
        Room ID
      </label>
      <Input
        aria-label="Room ID"
        title="Room ID"
        placeholder="Enter the ID of the room you'd like to join."
        value={roomID}
        onChange={(e) => {
          if (error) {
            setError("");
          }
          setRoomID(e.target.value);
        }}
      />
      <Button type="submit" className="mt-2 w-full">
        Join Room
      </Button>
      {error && <p className="text-destructive">{error}</p>}
    </form>
  );
});

JoinRoomForm.displayName = "JoinRoomForm";
