"use client";

import { Language } from "@/config/languages";
import { GameStateUpdatePayload } from "@code-racer/wss/src/events/server-to-client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { saveUserResultAction } from "../../actions";
import { getSnippetById } from "../../(play)/loaders";

// utils
import { calculateAccuracy, calculateCPM, noopKeys } from "./utils";
import { catchError } from "@/lib/utils";

// Components
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MultiplayerLoadingLobby from "../multiplayer-loading-lobby";
import { ReportButton } from "./buttons/report-button";
import Code from "./code";
import RaceDetails from "./race-details";
import RaceTimer from "./race-timer";
import { useToast } from "@/components/ui/use-toast";
import RaceTrackerMultiplayer from "./race-tracker-mutliplayer";
import { socket } from "@/lib/socket";

// Types
import { type RaceStatus, raceStatus } from "@code-racer/wss/src/types";
import type { Race, Snippet } from "@prisma/client";
import type { User } from "next-auth";
import { ChartTimeStamp, ReplayTimeStamp } from "./types";
import { useCheckForUserNavigator } from "@/lib/user-system";

type Participant = Omit<
  GameStateUpdatePayload["raceState"]["participants"][number],
  "socketId"
>;

export function GameMultiplayer({
  race,
  raceId,
  participantId,
  participants,
  currentRaceStatus,
  user,
}: {
  race: Race;
  raceId: string;
  participantId: string;
  participants: Participant[];
  currentRaceStatus: RaceStatus | null;
  user?: User;
}) {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [snippet, setSnippet] = useState<Snippet | undefined>();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [submittingResults, setSubmittingResults] = useState(false);
  const [totalErrors, setTotalErrors] = useState(0);

  const [chartTimeStamp, setChartTimeStamp] = useState<ChartTimeStamp[]>([]);
  const [replayTimeStamp, setReplayTimeStamp] = useState<ReplayTimeStamp[]>([]);

  const code = snippet?.code.trimEnd();
  const currentText = code?.substring(0, input.length);
  const errors = input
    .split("")
    .map((char, index) => (char !== currentText?.[index] ? index : -1))
    .filter((index) => index !== -1);

  const inputElement = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const position = code
    ? parseFloat(
        (((input.length - errors.length) / code.length) * 100).toFixed(2),
      )
    : null;

  const isRaceFinished = currentRaceStatus === raceStatus.FINISHED;
  const showRaceTimer = !!startTime && !isRaceFinished;

  const isUserOnAdroid = useCheckForUserNavigator("android");

  const startRaceEventHandlers = React.useCallback(async () => {
    const snippet = await getSnippetById(race.snippetId);
    if (!snippet) {
      toast({
        title: "Error",
        description: "Snippet not found",
      });
      return;
    }

    setSnippet(snippet);
  }, []);

  // Connection to wss
  useEffect(() => {
    startRaceEventHandlers();
    socket.emit("UserRaceRequest", {
      raceId,
      participantId,
    });

    // return () => {
    //   socket.disconnect();
    //   socket.off("connect");
    // };
  }, [raceId, startRaceEventHandlers]);

  // remove previous results
  useEffect(() => {
    localStorage.removeItem("chartTimeStamp");
    if (!inputElement.current) return;
    inputElement.current.focus();
  }, []);

  //send updated position to server
  useEffect(() => {
    if (!position) return;

    const gameLoop = setInterval(() => {
      if (currentRaceStatus === raceStatus.RUNNING) {
        socket.emit("PositionUpdate", {
          socketId: socket.id,
          raceParticipantId: participantId,
          position,
          raceId,
        });
      }
    }, 200);

    return () => clearInterval(gameLoop);
  }, [currentRaceStatus, position, participantId, raceId]);



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
      Backspace();
    }
    changeTimeStamps(e);
  }

  function handleKeyboardDownEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    if (isUserOnAdroid) {
      switch (e.key) {
        case "Enter":
          if (!startTime) {
            setStartTime(new Date());
          }
          if (input !== code?.slice(0, input.length)) return;
          Enter();
          break;
        // this is to delete the characters when "Enter" is pressed;
        case "Backspace":
          Backspace();
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
  }

  function Backspace() {
    if (input.length === 0) {
      return;
    }

    setInput((prevInput) => prevInput.slice(0, -1));

    const character = input.slice(-1);
    if (character !== " " && character !== "\n") {
      setChartTimeStamp((prevArray) => prevArray.slice(0, -1));
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
      while (lines?.[input.split("\n").length].charAt(i) === " ") {
        indent += " ";
        i++;
      }

      setInput((prevInput) => prevInput + "\n" + indent);
    } else {
      setInput((prevInput) => prevInput + "\n");
    }
  }

  function Key(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== code?.slice(input.length, input.length + 1)) {
      setTotalErrors((prevTotalErrors) => prevTotalErrors + 1);
    }

    setInput((prevInput) => prevInput + e.key);

    if (e.key !== " ") {
      const currTime = Date.now();
      const timeTaken = startTime ? (currTime - startTime.getTime()) / 1000 : 0;
      setChartTimeStamp((prevArray) => [
        ...prevArray,
        {
          char: e.key,
          accuracy: calculateAccuracy(input.length, totalErrors),
          cpm: calculateCPM(input.length, timeTaken),
          time: currTime,
        },
      ]);
    }

    setReplayTimeStamp((prev) => [
      ...prev,
      {
        char: input.slice(-1),
        textIndicatorPosition: input.length,
        time: Date.now(),
      },
    ]);
  }

// since this logic of setting timestamps will be reused
function changeTimeStamps(e: any) {
  if (!code) return;
  let value: string;

  // if keyboardDown event is the one that calls this
  if (e.key) {
    value = e.key;
    // so, this is where we can access the value of the key pressed on mobile
  } else {
    const data = e.nativeEvent.data;

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      // the 2nd to the last character
      const latestValue = input[input.length - 2];
      if (!latestValue) {
        value = "";
      } else {
        value = latestValue;
      }
    } else if (e.nativeEvent.inputType === "insertText") {
      value = data;
    } else {
      value = "Enter";
    }
  }

  if (value === code[input.length - 1] && value !== " ") {
    const currTime = Date.now();
    const timeTaken = startTime ? (currTime - startTime.getTime()) / 1000 : 0;
    setChartTimeStamp((prev) => [
      ...prev,
      {
        char: value,
        accuracy: calculateAccuracy(input.length, totalErrors),
        cpm: calculateCPM(input.length, timeTaken),
        time: currTime,
      },
    ]);
  }
  setReplayTimeStamp((prev) => [
    ...prev,
    {
      char: input.slice(-1),
      textIndicatorPosition: input.length,
      time: Date.now(),
    },
  ]);
}

  function handleRestart() {
    setStartTime(null);
    setInput("");
    setTotalErrors(0);
    setReplayTimeStamp([]);
    setChartTimeStamp([]);
  }

  useEffect(() => {
    if (isRaceFinished) {
      if (!startTime) return;
      const endTime = new Date();
      const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

      localStorage.setItem(
        "chartTimeStamp",
        JSON.stringify([
          ...chartTimeStamp,
          {
            char: input.slice(-1),
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
            char: input.slice(-1),
            textIndicatorPosition: input.length,
            time: Date.now(),
          },
        ]),
      );

      if (!snippet || !code) {
        setSubmittingResults(false);
        return;
      }

      if (user) {
        saveUserResultAction({
          raceParticipantId: participantId,
          timeTaken,
          errors: totalErrors,
          cpm: calculateCPM(code.length - 1, timeTaken),
          accuracy: calculateAccuracy(code.length - 1, totalErrors),
          snippetId: snippet.id,
        })
          .then((result) => {
            if (!result) {
              return router.refresh();
            }
            router.push(`/result?resultId=${result.id}`);
          })
          .catch((error) => {
            catchError(error);
          });
      } else {
        router.push(`/result?snippetId=${snippet.id}`);
      }

      setSubmittingResults(false);
    }
  });

  return (
    <>
      <div
        className="relative flex flex-col w-3/4 gap-2 p-4 mx-auto rounded-md lg:p-8 bg-accent"
        onClick={() => {
          inputElement.current?.focus();
        }}
        role="none"
      >
        {currentRaceStatus === raceStatus.RUNNING && (
          <>
            {raceId && code
              ? participants.map((p) => (
                  <RaceTrackerMultiplayer
                    key={p.id}
                    position={p.position}
                    participantId={p.id}
                  />
                ))
              : null}
            <div className="flex justify-between mb-2 md:mb-4">
              <Heading
                title={snippet?.name ? 
                  "Type " + " Snippet " + snippet?.name : "Type this code"}
                description="Start typing to get racing"
              />
              {user && snippet && (
                <ReportButton
                  snippetId={snippet.id}
                  language={snippet.language as Language}
                  handleRestart={handleRestart}
                />
              )}
            </div>
            <div className="flex ">
              <div className="flex-col w-10 px-1 ">
                {code?.split("\n").map((_, line) => (
                  <div
                    key={line}
                    className={
                      input.split("\n").length === line + 1
                        ? "text-center bg-slate-600 text-white  border-r-2 border-yellow-500"
                        : " text-center border-r-2 border-yellow-500"
                    }
                  >
                    {line + 1}
                  </div>
                ))}
              </div>

              {code && <Code code={code} input={input} />}
              <input
                type="text"
                defaultValue={input}
                ref={inputElement}
                onKeyDown={handleKeyboardDownEvent}
                onInput={handleInputEvent}
                disabled={isRaceFinished}
                className="absolute inset-y-0 left-0 w-full h-full p-8 rounded-md -z-40 focus:outline outline-blue-500 cursor-none"
                onPaste={(e) => e.preventDefault()}
              />
            </div>
          </>
        )}
        {errors.length > 0 ? (
          <span className="text-red-500">
            You must fix all errors before you can finish the race!
          </span>
        ) : null}
        {currentRaceStatus === raceStatus.FINISHED && (
          <div className="flex flex-col items-center space-y-8 text-2xl font-bold">
            <div className="w-8 h-8 border-4 border-t-4 rounded-full border-muted-foreground border-t-warning animate-spin"></div>
            Loading race results, please wait...
          </div>
        )}
        <div className="flex items-center justify-between">
          {showRaceTimer && (
            <>
              <RaceTimer stopTimer={isRaceFinished} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleRestart}>
                      Restart (ESC)
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Press Esc to reset</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>
      <RaceDetails submittingResults={submittingResults} />
    </>
  );
}

export default GameMultiplayer;
