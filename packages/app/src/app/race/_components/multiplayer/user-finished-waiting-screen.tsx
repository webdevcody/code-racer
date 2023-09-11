"use client";

import type {
  Participant,
  RunningGameInformationPayload,
} from "@code-racer/wss/src/store/types";
import type { RoomProps } from "../../rooms/page";

import { Heading } from "@/components/ui/heading";
import { socket } from "@/lib/socket";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateAvgInTimeStamp } from "../../_utils/race-utils";

type Props = {
  roomID: string;
} & RoomProps;

const UserFinishedWaitingScreen: React.FC<Props> = React.memo(
  ({ session, roomID }) => {
    const [participants, setParticipants] = React.useState<Array<Participant>>(
      []
    );

    const hadndleSendRunningGameInformation = React.useCallback(
      (payload: RunningGameInformationPayload) => {
        setParticipants(payload.participants);
      },
      []
    );

    React.useEffect(() => {
      if (roomID) {
        socket.emit("RequestRunningGameInformation", roomID);
      }
    }, [roomID]);

    React.useEffect(() => {
      socket.on(
        "SendRunningGameInformation",
        hadndleSendRunningGameInformation
      );
      return () => {
        socket.off(
          "SendRunningGameInformation",
          hadndleSendRunningGameInformation
        );
      };
    }, [hadndleSendRunningGameInformation]);

    return (
      <React.Fragment>
        <header>
          <Heading
            typeOfHeading="h2"
            size="h2"
            title="Good job!"
            description="You have finished this race. Below are the realtime results of the race."
          />
        </header>
        <hr className="my-4" />
        {participants.length > 0 && (
          <React.Fragment>
            <section>
              <Heading
                typeOfHeading="h3"
                size="h3"
                title="Realtime Updates"
                description="Note: This will be removed if everyone finishes the race. Don't worry, the final results will be displayed."
              />
              <div className="mt-8 flex flex-col gap-8 break-words overflow-auto whitespace-pre-wrap">
                {participants.map((participant, idx) => {
                  const avgInTimeStamp = calculateAvgInTimeStamp(
                    participant.timeStamp
                  );

                  return (
                    <div
                      key={participant.userID}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex gap-4">
                        <span>{idx + 1}.&#41;</span>
                        <div className="flex gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {participant.displayName.charAt(0)}
                            </AvatarFallback>
                            <AvatarImage
                              src={participant.displayImage}
                              alt={`${participant.displayName}'s avatar`}
                              width={12}
                              height={12}
                            />
                          </Avatar>
                          <span>
                            {participant.displayName}
                            {session?.id === participant.userID ||
                            socket.id === participant.userID
                              ? "(You)"
                              : undefined}
                          </span>
                        </div>
                      </div>
                      <section className="flex gap-2 flex-wrap">
                        <h4 className="sr-only">User Realtime Results</h4>
                        <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-2 flex flex-col gap-2">
                          <div>Progress</div>
                          <div>{participant.progress}%</div>
                        </div>
                        <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-2 flex flex-col gap-2">
                          <div>Avg. Accuracy</div>
                          <div>{avgInTimeStamp.accuracy}%</div>
                        </div>
                        <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-2 flex flex-col gap-2">
                          <div>Avg. CPM</div>
                          <div>{avgInTimeStamp.cpm}</div>
                        </div>
                        <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-2 flex flex-col gap-2">
                          <div>Avg. Errors</div>
                          <div>{avgInTimeStamp.errors}</div>
                        </div>
                        <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-2 flex flex-col gap-2">
                          <div>Time Taken</div>
                          <div>{participant.timeTaken}</div>
                        </div>
                      </section>
                    </div>
                  );
                })}
              </div>
            </section>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
);

UserFinishedWaitingScreen.displayName = "UserFinishedWaitingScreen";
export default UserFinishedWaitingScreen;
