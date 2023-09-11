"use client";

import type { Participant, RunningGameInformationPayload } from "@code-racer/wss/src/store/types";
import type { RoomProps } from "../../rooms/page";

import { Heading } from "@/components/ui/heading";
import { socket } from "@/lib/socket";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserFinishedWaitingScreen: React.FC<RoomProps> = React.memo(({ session }) => {
  const [participants, setParticipants] = React.useState<Array<Participant>>([]);

  const hadndleSendRunningGameInformation = React.useCallback((payload: RunningGameInformationPayload) => {
    setParticipants(payload.participants);
    console.log(payload);
  }, []);

  React.useEffect(() => {
    socket.on("SendRunningGameInformation", hadndleSendRunningGameInformation);
    return () => {
      socket.off("SendRunningGameInformation", hadndleSendRunningGameInformation);
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
      <hr className="py-4" />
      {participants.length > 0 && (
        <React.Fragment>
          <section>
            <Heading
              typeOfHeading="h3"
              size="h3"
              title="Realtime Updates"
            />
            <div className="flex flex-col gap-4 break-words overflow-auto whitespace-pre-wrap">
              {participants.map((participant, idx) => {
                let avgAccuracy = 0;
                let avgCpm = 0;
                let averageErrors = 0;
                let accuracySum = 0;
                let cpmSum = 0;
                let errorSum = 0;

                for (let idx = 0; idx < participant.timeStamp.length; ++idx) {
                  accuracySum += participant.timeStamp[idx].accuracy;
                  cpmSum += participant.timeStamp[idx].cpm;
                  errorSum += participant.timeStamp[idx].errors;
                }

                avgAccuracy = +(accuracySum / participant.timeStamp.length).toFixed(2);
                avgCpm = +(cpmSum / participant.timeStamp.length).toFixed(2);
                averageErrors = +(errorSum / participant.timeStamp.length).toFixed(2);

                return (
                  <div key={participant.userID} className="flex flex-col gap-2">
                    <div className="flex gap-4">
                      <span>{idx + 1}.&#41;</span>
                      <div className="flex gap-2">
                        <Avatar>
                          <AvatarFallback>{participant.displayName.charAt(0)}</AvatarFallback>
                          <AvatarImage
                            src={participant.displayImage}
                            alt={`${participant.displayName}'s avatar`}
                            width={18}
                            height={18}
                          />
                        </Avatar>
                        <span>{participant.displayName}{session?.id === participant.userID || socket.id === participant.userID ? "(You)" : undefined}</span>
                      </div>
                    </div>
                    <section className="flex gap-2 flex-wrap">
                      <h4 className="sr-only">User Realtime Results</h4>
                      <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-4 flex flex-col gap-2">
                        <div>Average Accuracy</div>
                        <div>{avgAccuracy}%</div>
                      </div>
                      <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-4 flex flex-col gap-2">
                        <div>Average CPM</div>
                        <div>{avgCpm}</div>
                      </div>
                      <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-4 flex flex-col gap-2">
                        <div>Average Errors</div>
                        <div>{averageErrors}</div>
                      </div>
                      <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-4 flex flex-col gap-2">
                        <div>Time Taken</div>
                        <div>{participant.timeTaken}</div>
                      </div>
                    </section>
                  </div>
                )
              })}
            </div>
          </section>
          
        </React.Fragment>
      )}
    </React.Fragment>
  );
});

UserFinishedWaitingScreen.displayName = "UserFinishedWaitingScreen";
export default UserFinishedWaitingScreen;