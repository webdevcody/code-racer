"use client";
import type { ParticipantsProgressPayload } from "@code-racer/wss/src/events/server-to-client";

import React from "react";

import { socket } from "@/lib/socket";
import ProgressTracker from "../common/progress-tracker";

type Props = {
  roomID: string;
}

const SectionOfProgressTrackers: React.FC<Props> = React.memo(({ roomID }) => {
  const [allPlayerProgress, setAllPlayerProgress] = React.useState<
    Array<ParticipantsProgressPayload>
  >([]);

  const handleUpdatePlayersProgress = React.useCallback(
    (payload: Array<ParticipantsProgressPayload>) => {
      setAllPlayerProgress((currentState) => {
        if (currentState.length === 0) {
          return payload;
        } else {
          for (let idx = 0; idx < currentState.length; ++idx) {
            for (let j = 0; j < payload.length; ++j) {
              if (currentState[idx].userID === payload[j].userID) {
                currentState[idx].progress = payload[j].progress;
              }
            }
          }

          return currentState;
        }
      });
    },
    []
  );

  const timerRef = React.useRef<NodeJS.Timer | undefined>();

  React.useEffect(() => {
    if (roomID) {
      timerRef.current = setInterval(() => {
        socket.emit("RequestAllPlayersProgress", roomID);
      }, 100);
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [roomID]);

  React.useEffect(() => {
    socket.on("SendAllPlayersProgress", handleUpdatePlayersProgress);
    return () => {
      socket.off("SendAllPlayersProgress", handleUpdatePlayersProgress);
    };
  }, [handleUpdatePlayersProgress]);

  return (
    <React.Fragment>
      {allPlayerProgress.length > 0 && (
        <TrackerContainer
          currentPlayer={{
            displayImage: allPlayerProgress[0].displayImage,
            displayName: allPlayerProgress[0].displayName,
            userID: allPlayerProgress[0].userID,
            progress: allPlayerProgress[0].progress,
          }}
          listOfPlayers={allPlayerProgress}
          amountInRecursion={0}
        />
      )}
    </React.Fragment>
  );
});

const TrackerContainer: React.FC<{
  currentPlayer: ParticipantsProgressPayload;
  listOfPlayers: Array<ParticipantsProgressPayload>;
  amountInRecursion: number;
}> = React.memo(({ currentPlayer, listOfPlayers, amountInRecursion }) => {
  return (
    <React.Fragment>
      <div>
        <div>{currentPlayer.displayName}</div>
        <ProgressTracker
          name={currentPlayer.displayName}
          image={currentPlayer.displayImage}
          progress={currentPlayer.progress}
        />
      </div>
      {amountInRecursion < listOfPlayers.length - 1 && (
        <TrackerContainer
          currentPlayer={{
            displayImage: listOfPlayers[amountInRecursion + 1].displayImage,
            displayName: listOfPlayers[amountInRecursion + 1].displayName,
            userID: listOfPlayers[amountInRecursion + 1].userID,
            progress: listOfPlayers[amountInRecursion + 1].progress,
          }}
          amountInRecursion={amountInRecursion + 1}
          listOfPlayers={listOfPlayers}
        />
      )}
    </React.Fragment>
  );
});

TrackerContainer.displayName = "TrackerContainer";
SectionOfProgressTrackers.displayName = "SectionOfProgressTrackers";
export default SectionOfProgressTrackers;
