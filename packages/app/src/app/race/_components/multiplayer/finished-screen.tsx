"use client";
import type { GameFinishedPayload } from "@code-racer/wss/src/events/server-to-client";
import type { RaceStatus } from "@code-racer/wss/src/consts";
import type { RoomProps } from "../../rooms/page";

import React from "react";

import { socket } from "@/lib/socket";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateAvgInTimeStamp } from "../../_utils/race-utils";

type Props = {
  roomID: string;
  IS_PLAYER_CURRENT_OWNER: boolean;
  changeGameState: (_status: RaceStatus) => void;
} & RoomProps;

/** Todo:
 *  1. Display a graph
 *   2. Make a  replay
 */
const FinishedScreen: React.FC<Props> = React.memo(
  ({ IS_PLAYER_CURRENT_OWNER, changeGameState, session, roomID }) => {
    const [gameFinishedDetails, setGameFinishedDetail] =
      React.useState<GameFinishedPayload>();

    const gameDuration = React.useMemo(() => {
      if (!gameFinishedDetails?.endedAt || gameFinishedDetails?.startedAt) {
        return null;
      } else {
        return ((gameFinishedDetails.endedAt.getTime() - gameFinishedDetails.startedAt.getTime()) / 1000).toFixed(2);
      }
    }, [gameFinishedDetails])

    const handleGameFinished = React.useCallback(
      (payload: GameFinishedPayload) => {
        console.log(payload);
        setGameFinishedDetail(payload);
      },
      []
    );

    React.useEffect(() => {
      if (roomID) {
        socket.emit("RequestFinishedGame", roomID);
      }
    }, [roomID]);

    React.useEffect(() => {
      socket.on("GameFinished", handleGameFinished);
      return () => {
        socket.off("GameFinished", handleGameFinished);
      };
    }, [handleGameFinished]);
    console.log(gameFinishedDetails);
    return (
      <React.Fragment>
        <header className="flex flex-col gap-8">
          <Heading
            typeOfHeading="h2"
            size="h2"
            title="The Race Has Ended!"
            description="Below are the final results for this race."
          />
          <div>
            {IS_PLAYER_CURRENT_OWNER && (
              <Button
                title="Play again"
                aria-label="Play Again"
                onClick={() => {
                  changeGameState("waiting");
                }}
              >
                Play again
              </Button>
            )}
            {!IS_PLAYER_CURRENT_OWNER && (
              <p>Waiting for room owner to restart the game...</p>
            )}
          </div>
        </header>

        <hr className="my-4" />

        {!gameFinishedDetails && <p>Fetching race details...</p>}

        {gameFinishedDetails && (
          <section className="overflow-x-auto">
            <Heading
              typeOfHeading="h3"
              size="h3"
              title="Race Results"
              description={gameDuration ? `The race spanned for ${gameDuration} seconds` : undefined}
            />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Avg. Accuracy</TableHead>
                  <TableHead>Avg. Cpm</TableHead>
                  <TableHead>Avg. Mistakes</TableHead>
                  <TableHead className="text-right">Time Taken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gameFinishedDetails.participants.map((participant) => {
                  const avgInTimeStamp = calculateAvgInTimeStamp(
                    participant.timeStamp
                  );

                  return (
                    <TableRow key={participant.userID}>
                      <TableCell className="flex gap-2">
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
                            ? " (You)"
                            : undefined}
                        </span>
                      </TableCell>

                      <TableCell>{avgInTimeStamp.accuracy}%</TableCell>
                      <TableCell>{avgInTimeStamp.cpm}</TableCell>
                      <TableCell>{avgInTimeStamp.errors}</TableCell>
                      <TableCell className="text-right">{participant.timeTaken}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

          </section>
        )}
      </React.Fragment>
    );
  }
);

FinishedScreen.displayName = "FinishedScreen";
export default FinishedScreen;
