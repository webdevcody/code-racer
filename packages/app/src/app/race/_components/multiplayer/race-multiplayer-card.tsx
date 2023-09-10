"use client";

import type { RoomProps } from "../../rooms/page";

import React from "react";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

import { socket } from "@/lib/socket";
import { useHandleRaceEvents } from "../../_utils/useHandleRaceEvents";
import { FALLBACK_IMG, RANDOM_USERNAME } from "@/config/consts";

import TypingCard from "../common/typing-card";
const ProgressTracker = dynamic(() => import("../common/progress-tracker"), {
  ssr: false,
});
const RowLineTracker = dynamic(() => import("../common/row-line-tracker"), {
  ssr: false,
});
const SectionOfProgressTrackers = dynamic(() => import("./section-of-progress-trackers"), {
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

    /** POTENTIAL FEATURE:
     *  Add the word in the timestamp as well
     *  so we can have a videolike experience
     *  for the user wherein they see
     *  where their enemies are currently at.
     */
    React.useEffect(() => {
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
    }, [state.timeStamp, session, roomID]);

    React.useEffect(() => {
      if (typingProgress && roomID) {
        socket.emit("SendUserProgress", {
          userID: session?.id ?? socket.id,
          roomID,
          progress: typingProgress,
        });
      }
    }, [typingProgress, session, roomID]);

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
            {!isUserFinished && (
              <React.Fragment>
                <section className="pb-4">
                  <h2 className="sr-only">
                    Section of Progress Trackers of Players
                  </h2>

                  <SectionOfProgressTrackers roomID={roomID} />

                  <div className="flex flex-col gap-2">
                    <div>You:</div>
                    <ProgressTracker
                      name={session?.name ?? RANDOM_USERNAME}
                      image={session?.image ?? FALLBACK_IMG}
                      progress={typingProgress}
                    />
                  </div>
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
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
);

RaceMultiplayerCard.displayName = "RaceMultiplayerCard";
export default RaceMultiplayerCard;
