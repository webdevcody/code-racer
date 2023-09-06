"use client";

import type { SendNotificationPayload } from "@code-racer/wss/src/events/server-to-client";

import React from "react";
import z from "zod";

import { Button } from "@/components/ui/button";

import { languageTypes } from "@/lib/validations/room";
import LanguageDropdown from "@/app/add-snippet/_components/language-dropdown";

import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";

// import CopyButton from '@/components/CopyButton'

type LanguageTypes = z.infer<typeof languageTypes>;

const CreateRoomForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [language, setLanguage] = React.useState<LanguageTypes | undefined>();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.connect();
    setIsLoading(true);
    const parsedLanguage = languageTypes.parse(language);
    socket.emit("UserCreateRoom", { language: parsedLanguage });
  };

  React.useEffect(() => {
    const handleRoomCreation = ({ roomId }: { roomId: string }) => {
      router.push(`/race/${roomId}`);
    }

    const receiveNotification = ({
      title,
      description,
      variant
    }: SendNotificationPayload) => {
      toast({ title, description, variant });
      setIsLoading(false);
    };

    socket.on("RoomCreated", handleRoomCreation);
    socket.on("SendNotification", receiveNotification);

    return () => {
      socket.off("RoomCreated", handleRoomCreation);
      socket.off("SendNotification", receiveNotification);
    }
  }, [router]);

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
    </form>
  );
};

export { CreateRoomForm };