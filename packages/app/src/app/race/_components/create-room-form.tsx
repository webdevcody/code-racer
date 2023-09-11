"use client";

import type { RoomProps } from "../rooms/page";
import type { LanguageType } from "@/lib/validations/room";
import type { SendRoomIDPayload } from "@code-racer/wss/src/events/server-to-client";

import React from "react";
import { useRouter } from "next/navigation";

import LanguageDropdown from "@/app/add-snippet/_components/language-dropdown";

import { Button } from "@/components/ui/button";

import { connectToSocket, socket } from "@/lib/socket";
import { FALLBACK_IMG, RANDOM_USERNAME } from "@/config/consts";

export const CreateRoomForm: React.FC<RoomProps> = React.memo(({ session }) => {
  const [language, setLanguage] = React.useState<LanguageType | undefined>();
  const [error, setError] = React.useState("");
  const [didSubmit, setDidSubmit] = React.useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!language) {
      setError("Please choose a language.");
      return;
    }
    connectToSocket({
      userID: session?.id ?? socket.id,
      displayName: session?.name ?? RANDOM_USERNAME,
      displayImage: session?.image ?? FALLBACK_IMG,
    });
    /** workaround to socket.id being undefined when socket is not connected. */
    setDidSubmit(true);
  };

  const submit = React.useCallback(() => {
    if (language) {
      socket.emit("CreateRoom", {
        userID: session?.id ?? socket.id,
        language,
      });
    }
  }, [session, language]);

  React.useEffect(() => {
    if (!didSubmit) {
      return;
    }
    socket.on("connect", submit);
    return () => {
      socket.off("connect", submit);
    };
  }, [didSubmit, submit]);

  React.useEffect(() => {
    const handleRoomCreation = ({ roomID }: SendRoomIDPayload) => {
      router.push(`/race/rooms/${encodeURIComponent(roomID)}`);
    };

    socket.on("SendRoomID", handleRoomCreation);
    return () => {
      socket.off("SendRoomID", handleRoomCreation);
    };
  }, [router, session]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <LanguageDropdown value={language} onChange={setLanguage} />
      <Button disabled={didSubmit} type="submit" className="mt-2 w-full">
        Create a room
      </Button>
      {error && <p className="text-destructive">{error}</p>}
    </form>
  );
});

CreateRoomForm.displayName = "CreateRoomForm";
