"use client";

import * as React from "react";

import { Prisma } from "@/lib/prisma";
import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { getSnippetById } from "../../(play)/loaders";
import { type RaceStatus, raceStatus } from "@code-racer/wss/src/types";
import { toast } from "@/components/ui/use-toast";
import {
  ChartTimeStamp,
  ReplayTimeStamp,
} from "@/app/race/_components/race/types";
import { Snippet } from "@prisma/client";
import { User } from "next-auth";
import MultiplayerLoadingLobby from "@/app/race/_components/multiplayer-loading-lobby";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  calculateAccuracy,
  calculateCPM,
  noopKeys,
} from "../../_components/race/utils";
import { saveUserResultAction } from "../../actions";
import { getRoomParticipantId } from "@/lib/wss-app-utils";
import { Heading } from "@/components/ui/heading";
import { ReportButton } from "../../_components/race/buttons/report-button";
import Code from "../../_components/race/code";
import RaceTimer from "../../_components/race/race-timer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RaceDetails from "../../_components/race/race-details";
import RaceTrackerMultiplayer from "../../_components/race/race-tracker-mutliplayer";
import { Language } from "@/config/languages";
import { GameStateUpdatePayload } from "@code-racer/wss/src/events/server-to-client";
import { useCheckForUserNavigator } from "@/lib/user-system";

type Participant = Omit<
  GameStateUpdatePayload["raceState"]["participants"][number],
  "socketId"
>;

export function Room({ user, roomId }: { user: User; roomId: string }) {
  const [input, setInput] = React.useState("");
  const [textIndicatorPosition, setTextIndicatorPosition] = React.useState(0);
  const [currentLineNumber, setCurrentLineNumber] = React.useState(0);
  const [currentCharPosition, setCurrentCharPosition] = React.useState(0);
  const [currentChar, setCurrentChar] = React.useState("");
  const [submittingResults, setSubmittingResults] = React.useState(false);
  const [totalErrors, setTotalErrors] = React.useState(0);

  const [snippet, setSnippet] = React.useState<Snippet | null>(null);
  const [race, setRace] = React.useState<Prisma.RaceGetPayload<{
    include: { participants: true };
  }> | null>(null);
  const [participants, setParticipants] = React.useState<Participant[]>([]);

  const [raceTimeStamp, setRaceTimeStamp] = React.useState<ChartTimeStamp[]>(
    [],
  );
  const [replayTimeStamp, setReplayTimeStamp] = React.useState<
    ReplayTimeStamp[]
  >([]);

  const [currentRaceStatus, setCurrentRaceStatus] =
    React.useState<RaceStatus>();
  const [raceStartCountdown, setRaceStartCountdown] = React.useState(0);
  const [startTime, setStartTime] = React.useState<Date | null>(null);

  const isUserOnAdroid = useCheckForUserNavigator("android");

  const code = snippet?.code.trimEnd();
  const currentText = code?.substring(0, input.length);
  const errors = input
    .split("")
    .map((char, index) => (char !== currentText?.[index] ? index : -1))
    .filter((index) => index !== -1);

  const position = code
    ? parseFloat(
        (((input.length - errors.length) / code.length) * 100).toFixed(2),
      )
    : null;

  const inputElement = React.useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const isRaceFinished = currentRaceStatus === raceStatus.FINISHED;
  const showRaceTimer = !!startTime && !isRaceFinished;

  useEffect(() => {
    // socket.

    socket.emit("UserJoinRoom", {
      userId: user.id,
      raceId: roomId,
    });

    socket.on("RoomJoined", async (payload) => {
      const { race } = payload;
      const snippet = await getSnippetById(race.snippetId);
      if (!snippet) {
        return toast({
          title: "Error",
          description: "Snippet not found",
        });
      }

      setSnippet(snippet);
      setRace(race);
      setParticipants(
        race.participants.map((p) => ({
          ...p,
          position: 0,
          finishedAt: null,
        })),
      );

      socket.on("UpdateParticipants", async (payload) => {
        console.log("updating participants");
        setParticipants(
          payload.participants.map((p) => ({
            ...p,
            position: 0,
            finishedAt: null,
          })),
        );
      });
    });

    socket.on("GameStateUpdate", (payload) => {
      const { raceState } = payload;
      setParticipants(raceState.participants);
      setCurrentRaceStatus(raceState.status);

      if (raceState.countdown) {
        setRaceStartCountdown(raceState.countdown);
      } else if (raceState.countdown === 0) {
        setStartTime(new Date());
      }
    });

    // socket.on("UpdateParticipants", async (payload) => {
    //   console.log("updating participants")
    //   setParticipants(payload.participants);
    // });

    return () => {
      socket.emit("UserLeaveRoom", { raceId: roomId, userId: user.id });
      // socket.disconnect();
      // socket.off("connect");
    };
  }, []);

  function handleGameStart() {
    socket.emit("StartRaceCountdown", { raceId: roomId });
  }

  useEffect(() => {
    if (!race?.id || currentRaceStatus !== raceStatus.RUNNING || !position)
      return;

    const gameLoop = setInterval(() => {
      if (currentRaceStatus === raceStatus.RUNNING) {
        socket.emit("PositionUpdate", {
          socketId: socket.id,
          raceParticipantId: getRoomParticipantId({ roomId, userId: user.id }),
          position,
          raceId: roomId,
        });
      }
    }, 200);
    return () => clearInterval(gameLoop);
  }, [currentRaceStatus, position, user, roomId]);
  //end of multiplayer-specific -----------------------------------------------------------------------------------

  async function endRace() {
    if (!startTime) return;
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

    localStorage.setItem(
      "raceTimeStamp",
      JSON.stringify([
        ...raceTimeStamp,
        {
          char: currentChar,
          accuracy: calculateAccuracy(input.length, totalErrors),
          cpm: calculateCPM(input.length, timeTaken),
          time: Date.now(),
        },
      ]),
    );

    localStorage.setItem(
      "replayTimeStamp",
      JSON.stringify([
        ...replayTimeStamp,
        {
          char: currentChar,
          textIndicatorPosition,
          currentLineNumber,
          currentCharPosition,
          errors,
          totalErrors,
          time: Date.now(),
        },
      ]),
    );

    if (!snippet || !code) {
      setSubmittingResults(false);
      return;
    }

    const result = await saveUserResultAction({
      raceParticipantId: getRoomParticipantId({ roomId, userId: user.id }),
      timeTaken,
      errors: totalErrors,
      cpm: calculateCPM(code.length - 1, timeTaken),
      accuracy: calculateAccuracy(code.length - 1, totalErrors),
      snippetId: snippet.id,
    });

    if (!result) {
      return router.refresh();
    }

    router.push(`/result?resultId=${result.id}`);

    setSubmittingResults(false);
  }

  useEffect(() => {
    if (isRaceFinished) {
      endRace();
    }
  }, [isRaceFinished]);

  useEffect(() => {
    // Focus Input
    inputElement.current?.focus();

    // Calculate the current line and cursor position in that line
    const lines = input.split("\n");
    setCurrentLineNumber(lines.length);
    setCurrentCharPosition(lines[lines.length - 1].length);
    setReplayTimeStamp((prev) => [
      ...prev,
      {
        char: currentChar,
        textIndicatorPosition,
        currentLineNumber,
        currentCharPosition,
        errors,
        totalErrors,
        time: Date.now(),
      },
    ]);
  }, [input]);

  function handleKeyboardDownEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    // Restart
    if (e.key === "Escape") {
      handleRestart();
      return;
    }
    // Unfocus Shift + Tab
    if (e.shiftKey && e.key === "Tab") {
      e.currentTarget.blur();
      return;
    }
    // Reload Control + r
    if (e.ctrlKey && e.key === "r") {
      e.preventDefault;
      return;
    }
    // Catch Alt Gr - Please confirm I am unable to test this
    if (e.ctrlKey && e.altKey) {
      e.preventDefault();
    }

    if (noopKeys.includes(e.key)) {
      e.preventDefault();
    } else {
      switch (e.key) {
        case "Backspace":
          Backspace();
          break;
        case "Enter":
          if (input !== code?.slice(0, input.length)) {
            return;
          }
          Enter();
          if (!startTime) {
            setStartTime(new Date());
          }
          break;
        default:
          if (input !== code?.slice(0, input.length)) {
            return;
          }
          Key(e);
          if (!startTime) {
            setStartTime(new Date());
          }
          break;
      }
    }
    const lines = input.split("\n");
    setCurrentLineNumber(lines.length);
    setCurrentCharPosition(lines[lines.length - 1].length);
    setReplayTimeStamp((prev) => [
      ...prev,
      {
        char: currentChar,
        textIndicatorPosition,
        currentLineNumber,
        currentCharPosition,
        errors,
        totalErrors,
        time: Date.now(),
      },
    ]);
  }

  function Backspace() {
    if (input.length === 0) {
      return;
    }

    if (textIndicatorPosition === input.length) {
      setInput((prevInput) => prevInput.slice(0, -1));
    }

    setTextIndicatorPosition(
      (prevTextIndicatorPosition) => prevTextIndicatorPosition - 1,
    );

    if (raceTimeStamp.length > 0 && errors.length == 0) {
      setRaceTimeStamp((prev) => prev.slice(0, -1));
    }
  }

  function Enter() {
    const lines = code?.split("\n");
    if (
      input === code?.slice(0, input.length) &&
      code.charAt(input.length) === "\n"
    ) {
      let indent = "";
      let i = 0;
      while (lines?.[currentLineNumber].charAt(i) === " ") {
        indent += " ";
        i++;
      }

      setInput(input + "\n" + indent);
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          return prevTextIndicatorPosition + 1 + indent.length;
        } else {
          return prevTextIndicatorPosition;
        }
      });
    } else {
      setInput(input + "\n");
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          return prevTextIndicatorPosition + 1;
        } else {
          return prevTextIndicatorPosition;
        }
      });
    }
  }

  function Key(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== code?.slice(input.length, input.length + 1)) {
      setTotalErrors((prevTotalErrors) => prevTotalErrors + 1);
    }

    if (
      e.key === code?.[input.length] &&
      errors.length === 0 &&
      e.key !== " "
    ) {
      const currTime = Date.now();
      const timeTaken = startTime ? (currTime - startTime.getTime()) / 1000 : 0;
      setRaceTimeStamp((prev) => [
        ...prev,
        {
          char: e.key,
          accuracy: calculateAccuracy(input.length, totalErrors),
          cpm: calculateCPM(input.length, timeTaken),
          time: currTime,
        },
      ]);
      setCurrentChar("");
    }

    setInput((prevInput) => prevInput + e.key);
    setTextIndicatorPosition(
      (prevTextIndicatorPosition) => prevTextIndicatorPosition + 1,
    );
  }
  function handleInputEvent(e: any /** React.FormEvent<HTMLInputElement>*/) {
    if (!isUserOnAdroid) return;
    if (!startTime) {
      setStartTime(new Date());
    }
    const data = e.nativeEvent.data;

    if (
      input !== code?.slice(0, input.length) &&
      e.nativeEvent.inputType !== "deleteContentBackward"
    ) {
      e.preventDefault();
      return;
    }

    if (e.nativeEvent.inputType === "insertText") {
      setInput((prevInput) => prevInput + data);
    } else if (e.nativeEvent.inputType === "deleteContentBackward") {
      // if the user pressed backspace on mobile, data is null
      Backspace();
    } else {
      Enter();
    }
    changeTimeStamps();
  }

  function changeTimeStamps() {
    setReplayTimeStamp((prev) => [
      ...prev,
      {
        char: input.slice(-1),
        textIndicatorPosition: input.length,
        time: Date.now(),
      },
    ]);
  }

  function handleKeyboardUpEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    // For ANDROID.
    // since the enter button on a mobile keyboard/keypad actually
    // returns a e.key of "Enter", we just set a condition for that.
    if (isUserOnAdroid) {
      switch (e.key) {
        case "Enter":
          if (!startTime) {
            setStartTime(new Date());
          }
          handleInputEvent(e);
          break;
      }
      return;
    }

    // Restart
    if (e.key === "Escape") {
      handleRestart();
      return;
    }
    // Unfocus Shift + Tab
    if (e.shiftKey && e.key === "Tab") {
      e.currentTarget.blur();
      return;
    }
    // Reload Control + r
    if (e.ctrlKey && e.key === "r") {
      e.preventDefault;
      return;
    }
    // Catch Alt Gr - Please confirm I am unable to test this
    if (e.ctrlKey && e.altKey) {
      e.preventDefault();
    }

    if (noopKeys.includes(e.key)) {
      e.preventDefault();
    } else {
      switch (e.key) {
        case "Backspace":
          Backspace();
          break;
        case "Enter":
          if (input !== code?.slice(0, input.length)) {
            return;
          }
          Enter();
          if (!startTime) {
            setStartTime(new Date());
          }
          break;
        default:
          if (input !== code?.slice(0, input.length)) {
            return;
          }
          Key(e);
          if (!startTime) {
            setStartTime(new Date());
          }
          break;
      }
    }
    changeTimeStamps();
  }

  function handleRestart() {
    setStartTime(null);
    setInput("");
    setTextIndicatorPosition(0);
    setTotalErrors(0);
  }

  return (
    <div
      className="relative flex flex-col w-3/4 gap-2 p-4 mx-auto rounded-md lg:p-8 bg-accent"
      onClick={() => {
        inputElement.current?.focus();
      }}
      role="none" // eslint fix - will remove the semantic meaning of an element while still exposing it to assistive technology
    >
      {JSON.stringify(race)}
      {participants &&
        currentRaceStatus != raceStatus.RUNNING &&
        !startTime && (
          <MultiplayerLoadingLobby participants={participants}>
            <Button onClick={handleGameStart}>Start game</Button>
            {currentRaceStatus === raceStatus.COUNTDOWN &&
              !startTime &&
              Boolean(raceStartCountdown) && (
                <div className="text-2xl font-bold text-center">
                  Game starting in: {raceStartCountdown}
                </div>
              )}
          </MultiplayerLoadingLobby>
        )}
    </div>
  );
}
