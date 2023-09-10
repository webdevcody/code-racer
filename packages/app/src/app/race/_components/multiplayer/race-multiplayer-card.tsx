"use client";

import type { RoomInformation } from "@code-racer/wss/src/store/types";

import React from "react";
import dynamic from "next/dynamic";

import { socket } from "@/lib/socket";
import { useHandleRaceEvents } from "../../_utils/useHandleRaceEvents";
import { Loader } from "lucide-react";

const TypingCard = dynamic(() => import("../common/typing-card"));

type Props = {
  roomID: string;
}

const RaceMultiplayerCard: React.FC<Props> = React.memo(
  ({ roomID }) => {
    const {
      handleChangeSnippet,
      handleInputChange,
      state,
      handleKeyDownEvent,
      code,
    } = useHandleRaceEvents();

    React.useEffect(() => {
      socket.emit("RequestRoomInformation", roomID);

      const handleRoomInformationResponse = ({
        snippet,
        startedAt,
        endedAt,
        roomOwnerID,
      }: RoomInformation) => {
        handleChangeSnippet(snippet);
      };

      socket.on("SendRoomInformation", handleRoomInformationResponse);
      return () => {
        socket.off("SendRoomInformation", handleRoomInformationResponse);
      };
    }, [roomID, handleChangeSnippet]);

    return (
      <React.Fragment>
        {!state.snippet && (
          <div className="flex flex-col gap-4">
            <Loader className="animate-spin w-6 h-6" />
            Fetching snippet...
          </div>
        )}

        {state.snippet && (
          <React.Fragment>
            <React.Suspense>
              <TypingCard
                handleKeyDownEvent={handleKeyDownEvent}
                didUserMistype={state.displayedErrorMessage ? true : false}
                handleInputChange={handleInputChange}
                input={state.input}
                code={state.snippet.code}
              />
            </React.Suspense>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
);

RaceMultiplayerCard.displayName = "RaceMultiplayerCard";
export default RaceMultiplayerCard;