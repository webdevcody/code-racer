"use client";

import type { ParticipantInformation } from "@code-racer/wss/src/new-game";
import type { RoomProps } from "../page";
import type { SendRoomIDPayload } from "@code-racer/wss/src/events/server-to-client";

import React from "react";

import { connectToSocket, socket } from "@/lib/socket";
import { FALLBACK_IMG, RANDOM_USERNAME } from "@/config/consts";
import { ListOfPlayers } from "../../_components/list-of-players";
import { GameScreen } from "../../_components/game-screen";

type Props = {
  roomID: string;
} & RoomProps;

export const ClientRoom: React.FC<Props> = React.memo(({ session, roomID }) => {
  const [isSocketConnected, setIsSocketConnected] = React.useState(
    socket.connected
  );
  const [shouldRenderRoom, setShouldRenderRoom] = React.useState(false);

  const [listOfPlayers, setListOfPlayers] = React.useState<
    Array<ParticipantInformation>
  >([]);
  const [roomOwnerID, setRoomOwnerID] = React.useState("");

  /** VERIFY ROOM ID */
  React.useEffect(() => {
    if (!isSocketConnected) {
      connectToSocket({
        userID: session?.id,
        displayName: session?.name ?? RANDOM_USERNAME,
        displayImage: session?.image ?? FALLBACK_IMG,
      });
      setIsSocketConnected(true);
    }

    if (isSocketConnected) {
      socket.emit("CheckIfRoomIDExists", roomID);
    }

    const handleRoomIDVerified = ({ roomOwnerID }: SendRoomIDPayload) => {
      /** MEANS THAT THE USER JOINED THE ROOM BY TYPING
       *  IN THE WHOLE URL, NOT BY ENTERING THE ROOM ID IN
       *  THE ROOMS PAGE.
       */
      setShouldRenderRoom(true);
      setRoomOwnerID(roomOwnerID);
    };

    const handlePlayerJoinedRoom = (players: Array<ParticipantInformation>) => {
      setListOfPlayers(players);
    };

    const handleSendRoomOwnerID = (roomOwnerID: string) => {
      setRoomOwnerID(roomOwnerID);
    };

    socket.on("PlayerJoinedOrLeftRoom", handlePlayerJoinedRoom);
    socket.on("SendRoomID", handleRoomIDVerified);
    socket.on("SendRoomOwnerID", handleSendRoomOwnerID);

    return () => {
      socket.off("SendRoomID", handleRoomIDVerified);
      socket.off("PlayerJoinedOrLeftRoom", handlePlayerJoinedRoom);
      socket.off("SendRoomOwnerID", handleSendRoomOwnerID);
    };
  }, [session, isSocketConnected, roomID]);

  return (
    <div className="py-12 max-h-[60rem]">
      {!shouldRenderRoom && (
        <div>
          Verifying room ID... &#40;If the page stays like this for some time,
          please try refreshing the page. &#41;
        </div>
      )}

      {shouldRenderRoom && (
        <div className="flex flex-col md:flex-row gap-12">
          <GameScreen
            session={session}
            roomID={roomID}
            roomOwnerID={roomOwnerID}
            amountOfPlayers={listOfPlayers.length}
          />
          <ListOfPlayers
            roomOwnerID={roomOwnerID}
            session={session}
            listOfPlayers={listOfPlayers}
          />
        </div>
      )}
    </div>
  );
});

ClientRoom.displayName = "ClientRoom";
