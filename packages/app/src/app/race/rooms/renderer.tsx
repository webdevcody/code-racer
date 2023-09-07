"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { connectToSocket, socket } from "@/lib/socket";

import { FALLBACK_IMG, RANDOM_USERNAME } from "@/config/consts";
import { toast } from "@/components/ui/use-toast";
import { NotConnectedToRoomPage } from "./not-connected-page";

export type RoomProps = {
  session: {
    id: string | null | undefined;
    name: string | null | undefined;
    image: string | null | undefined;
  } | undefined;
};

export const Renderer: React.FC<RoomProps> = ({
  session
}) => {
  const [shouldRenderRoom, setShouldRenderRoom] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const roomID = searchParams.get("roomID");

  React.useEffect(() => {
    if (searchParams.has("roomID")) {
      if (!roomID) {
        router.replace("/race/rooms");
        toast({ title: "Please enter room ID" });
        return;
      }

      if (!socket.connected) {
        connectToSocket({
          userID: session?.id,
          displayName: session?.name ?? RANDOM_USERNAME,
          displayImage: session?.image ?? FALLBACK_IMG
        });
      }

      socket.emit("CheckIfRoomIDExists", roomID);
    }

    // const handleRoomIDVerified = () => {
    //   setShouldRenderRoom(true);
    // };

    // socket.on("SendRoomID", handleRoomIDVerified);
    // return () => {
    //   socket.off("SendRoomID", handleRoomIDVerified);
    // };
  }, [session, roomID, router, searchParams]);

  return (
    <React.Fragment>
      {!shouldRenderRoom && <NotConnectedToRoomPage session={session} />}

      {shouldRenderRoom && (<p>{roomID}</p>)}
    </React.Fragment>
  );
};