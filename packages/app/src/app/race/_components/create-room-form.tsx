"use client";

import type { RoomProps } from "../rooms/renderer";
import type { LanguageType } from "@/lib/validations/room";

import React from "react";
import { useRouter } from "next/navigation";

import LanguageDropdown from "@/app/add-snippet/_components/language-dropdown";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { connectToSocket, socket } from "@/lib/socket";
import { FALLBACK_IMG, RANDOM_USERNAME } from "@/config/consts";


export const CreateRoomForm: React.FC<RoomProps> = React.memo(({ session }) => {
  const [language, setLanguage] = React.useState<LanguageType | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!language) {
      setError("Please choose a language.");
      return;
    }
    setIsLoading(true);

    if (!socket.connected) {
      connectToSocket({
        userID: session?.id ?? socket.id,
        displayName: session?.name ?? RANDOM_USERNAME,
        displayImage: session?.image ?? FALLBACK_IMG
      });
    }

    socket.emit("CreateRoom", {
      userID: session?.id ?? socket.id,
      language
    });
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
  }, [router, session]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <LanguageDropdown value={language} onChange={setLanguage} />
      <Button type="submit" className="mt-2 w-full">
        {isLoading ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          "Create a room"
        )}
      </Button>
      {error && (
        <p className="text-destructive">{error}</p>
      )}
    </form>
  );
});

CreateRoomForm.displayName = "CreateRoomForm";