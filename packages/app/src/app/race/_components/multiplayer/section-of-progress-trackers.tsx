"use client";
import type { ParticipantsProgressPayload } from "@code-racer/wss/src/events/server-to-client";
import type { RoomProps } from "../../rooms/page";

import React from "react";

import { socket } from "@/lib/socket";
import ProgressTracker from "../common/progress-tracker";

const SectionOfProgressTrackers: React.FC<RoomProps> = React.memo(
  ({ session }) => {
    const [allPlayerProgress, setAllPlayerProgress] = React.useState<
      Array<ParticipantsProgressPayload>
    >([]);

    const handleUpdatePlayersProgress = React.useCallback(
      (payload: Array<ParticipantsProgressPayload>) => {
        setAllPlayerProgress(payload);
      },
      []
    );

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
            session={session}
          />
        )}
      </React.Fragment>
    );
  }
);

const TrackerContainer: React.FC<
  {
    currentPlayer: ParticipantsProgressPayload;
    listOfPlayers: Array<ParticipantsProgressPayload>;
    amountInRecursion: number;
  } & RoomProps
> = React.memo(
  ({ currentPlayer, listOfPlayers, amountInRecursion, session }) => {
    return (
      <React.Fragment>
        <div>
          <span>
            {currentPlayer.displayName}
            {session?.id === currentPlayer.userID ||
            socket.id === currentPlayer.userID
              ? "(You)"
              : undefined}
          </span>
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
            session={session}
          />
        )}
      </React.Fragment>
    );
  }
);

TrackerContainer.displayName = "TrackerContainer";
SectionOfProgressTrackers.displayName = "SectionOfProgressTrackers";
export default SectionOfProgressTrackers;
