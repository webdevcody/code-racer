"use client";

import React, { useState, useEffect, useRef } from "react";
import { saveUserResultAction } from "../../actions";
import { useRouter } from "next/navigation";

// utils
import { calculateAccuracy, calculateCPM, noopKeys } from "./utils";

// Componenets
import RaceTracker from "./race-tracker";
import Header from "./header";
import LineNumbers from "./line-numbers";
import Code from "./code";
import Footer from "./footer";

// Types
import type { Snippet } from "@prisma/client";
import type { User } from "next-auth";
import type { ChartTimeStamp } from "./types";
import type { ReplayTimeStamp } from "./types";
import { catchError } from "@/lib/utils";

type RacePracticeProps = {
  user?: User;
  snippet: Snippet;
};

export default function RacePractice({ user, snippet }: RacePracticeProps) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalErrors, setTotalErrors] = useState(0);
  const [chartTimeStamp, setChartTimeStamp] = useState<ChartTimeStamp[]>([]);
  const [replayTimeStamp, setReplayTimeStamp] = useState<ReplayTimeStamp[]>([]);

  const inputElement = useRef<HTMLInputElement | null>(null);
  const code = snippet.code.trimEnd();
  const router = useRouter();
  const isRaceFinished = input === code;

  useEffect(() => {
    localStorage.removeItem("chartTimeStamp");
    if (!inputElement.current) return;
    inputElement.current.focus();
  });

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

      if (user) {
        saveUserResultAction({
          timeTaken,
          errors: totalErrors,
          cpm: calculateCPM(code.length - 1, timeTaken),
          accuracy: calculateAccuracy(code.length - 1, totalErrors),
          snippetId: snippet.id,
        })
          .then((result) => {
            router.push(`/result?resultId=${result.id}`);
          })
          .catch((error) => catchError(error));
      } else {
        router.push(`/result?snippetId=${snippet.id}`);
      }
    }
  });

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
      e.preventDefault();
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
          if (input !== code.slice(0, input.length)) {
            return;
          }
          Enter();
          if (!startTime) {
            setStartTime(new Date());
          }
          break;
        default:
          if (input !== code.slice(0, input.length)) {
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
    if (character !== " " && character !== "\n")
      setChartTimeStamp((prevArray) => prevArray.slice(0, -1));
  }

  function Enter() {
    if (code.charAt(input.length) !== "\n") {
      setInput((prevInput) => prevInput + "\n");
      return;
    }

    const lines = input.split("\n");
    const allLines = code.split("\n");
    const nextLine = allLines[lines.length];
    if (code.charAt(input.length) === "\n") {
      let indent = "";
      let i = 0;
      while (nextLine.charAt(i) === " ") {
        indent += " ";
        i++;
      }
      setInput((prevInput) => prevInput + "\n" + indent);
    }
  }

  function Key(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== code.slice(input.length, input.length + 1)) {
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

  function handleRestart() {
    setStartTime(null);
    setInput("");
    setTotalErrors(0);
    setReplayTimeStamp([]);
    setChartTimeStamp([]);
  }

  return (
    <div
      className="relative flex flex-col w-[clamp(10rem,95%,50rem)] gap-2 p-4 mx-auto rounded-md lg:p-8 bg-accent"
      onClick={() => {
        inputElement.current?.focus();
      }}
      role="none"
    >
      <RaceTracker
        user={user}
        position={input.length}
        codeLength={code.length}
      />
      <Header user={user} snippet={snippet} handleRestart={handleRestart} />
      <section className="flex">
        <LineNumbers code={code} currentLineNumber={input.split("\n").length} />
        <Code code={code} input={input} />
        <input
          type="text"
          ref={inputElement}
          onKeyDown={handleKeyboardDownEvent}
          disabled={input === code}
          className="absolute inset-y-0 left-0 w-full h-full p-8 rounded-md -z-40 focus:outline outline-blue-500 cursor-none"
          onPaste={(e) => e.preventDefault()}
          data-cy="race-practice-input"
          autoComplete="off"
        />
      </section>
      <Footer
        code={code}
        input={input}
        startTime={startTime}
        handleRestart={handleRestart}
      />
    </div>
  );
}
