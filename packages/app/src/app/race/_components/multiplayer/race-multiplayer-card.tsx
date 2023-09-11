"use client";

import type { RoomProps } from "../../rooms/page";

import React from "react";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

import { socket } from "@/lib/socket";
import { useHandleRaceEvents } from "../../_utils/useHandleRaceEvents";

import TypingCard from "../common/typing-card";
const RowLineTracker = dynamic(() => import("../common/row-line-tracker"), {
  ssr: false,
});
const SectionOfProgressTrackers = dynamic(() => import("./section-of-progress-trackers"), {
  ssr: false
});
const UserFinishedWaitingScreen = dynamic(() => import("./user-finished-waiting-screen"), {
  ssr: false
});

type Props = {
  roomID: string;
} & RoomProps;

const RaceMultiplayerCard: React.FC<Props> = React.memo(
  ({ roomID, session }) => {
    const {
      handleChangeSnippet,
      handleInputChange,
      state,
      handleKeyDownEvent,
      code,
      isUserFinished,
      typingProgress,
      currentLineNumber,
      amountOfLineBreaks,
    } = useHandleRaceEvents();

    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    /** Get snippet once */
    React.useEffect(() => {
      if (roomID) {
        socket.emit("RequestRoomSnippet", roomID);
      }
      socket.on("SendRoomSnippet", handleChangeSnippet);
      return () => {
        socket.off("SendRoomSnippet", handleChangeSnippet);
      };
    }, [roomID, handleChangeSnippet]);

    React.useEffect(() => {
      if (roomID) {
        /** to load the progress trackers on page load */
        socket.emit("RequestAllPlayersProgress", roomID);
      }
    }, [roomID]);

    /** POTENTIAL FEATURE:
     *  Add the word in the timestamp as well
     *  so we can have a videolike experience
     *  for the user wherein they see
     *  where their enemies are currently at.
     */
    React.useEffect(() => {
      if (roomID) {
        socket.emit("SendUserProgress", {
          userID: session?.id ?? socket.id,
          roomID,
          progress: typingProgress,
        });
      }
      if (state.timeStamp.length > 0 && roomID) {
        const latestTimeStamp = state.timeStamp[state.timeStamp.length - 1];
        socket.emit("SendUserTimeStamp", {
          roomID: roomID,
          userID: session?.id ?? socket.id,
          cpm: latestTimeStamp.cpm,
          accuracy: latestTimeStamp.accuracy,
          totalErrors: latestTimeStamp.errors,
        });
      }
    }, [state.timeStamp, typingProgress, session, roomID]);

    React.useEffect(() => {
      if (roomID && isUserFinished) {
        socket.emit("SendUserHasFinished", {
          userID: session?.id ?? socket.id,
          roomID,
          timeTaken: state.totalTime,
        });
      }
    }, [state.totalTime, isUserFinished, session, roomID]);

    const onDivClick = React.useCallback((node: HTMLDivElement) => {
      if (node) {
        node.addEventListener("click", () => {
          if (!textAreaRef.current) {
            return;
          }

          if (!textAreaRef.current.disabled) {
            textAreaRef.current.focus();
          }
        });
      }
    }, []);

    return (
      <React.Fragment>
        {!isUserFinished && (
          <div
            className="relative focus-within:outline cursor-text focus-within:outline-4 focus-within:outline-border focus-within:outline-offset-4 focus-within:outline-offset-background dark:text-white text-black bg-slate-200/60 dark:bg-black/60 rounded-lg mx-auto dark:border-2 shadow-md shadow-black/20 px-4 py-8"
            ref={onDivClick}
          >
            {!state.snippet && (
              <div className="flex flex-col gap-4">
                <Loader className="animate-spin w-6 h-6" />
                Fetching snippet...
              </div>
            )}

            {state.snippet && (

              <React.Fragment>
                <section className="pb-4">
                  <h2 className="sr-only">
                    Section of Progress Trackers of Players
                  </h2>
                  <SectionOfProgressTrackers session={session} />
                </section>

                <div className="flex gap-2 relative rounded-lg my-1">
                  <div className="grid border-r-2 border-yellow-600 m-1">
                    <RowLineTracker
                      currentLineNumber={currentLineNumber}
                      amountOfRows={amountOfLineBreaks}
                    />
                  </div>
                  <TypingCard
                    handleKeyDownEvent={handleKeyDownEvent}
                    didUserMistype={state.displayedErrorMessage ? true : false}
                    handleInputChange={handleInputChange}
                    input={state.input}
                    code={code}
                    ref={textAreaRef}
                  />
                </div>
                {state.displayedErrorMessage && (
                  <p className="px-4 text-sm mt-4 text-destructive">
                    {state.displayedErrorMessage}
                  </p>
                )}

                <div className="text-sm lg:text-base">
                  Elapsed time: {state.totalTime} seconds
                </div>
              </React.Fragment>
            )}
          </div>
        )}
        {isUserFinished && <UserFinishedWaitingScreen session={session} />}
      </React.Fragment>
    );
  }
);

RaceMultiplayerCard.displayName = "RaceMultiplayerCard";
export default RaceMultiplayerCard;
