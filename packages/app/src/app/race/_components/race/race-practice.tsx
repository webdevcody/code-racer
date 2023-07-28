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
import { RaceTimeStampProps, ReplayTimeStampProps } from "./types";
import type { Snippet } from "@prisma/client";
import type { User } from "next-auth";

export default function RacePractice({
  user,
  snippet,
}: {
  user?: User;
  snippet: Snippet;
}) {
  const [input, setInput] = useState("");
  const [textIndicatorPosition, setTextIndicatorPosition] = useState(0);
  const [currentLineNumber, setCurrentLineNumber] = useState(0);

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalErrors, setTotalErrors] = useState(0);

  const [raceTimeStamp, setRaceTimeStamp] = useState<RaceTimeStampProps[]>([]);
  const [replayTimeStamp, setReplayTimeStamp] = useState<
    ReplayTimeStampProps[]
  >([]);

  const code = snippet.code.trimEnd();
  const currentText = code.substring(0, input.length);
  const errors = input
    .split("")
    .map((char, index) => (char !== currentText[index] ? index : -1))
    .filter((index) => index !== -1);

  const inputElement = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Focus Input
    inputElement.current?.focus();

    // Calculate the current line and cursor position in that line
    const lines = input.split("\n");
    setCurrentLineNumber(lines.length);
    setReplayTimeStamp((prev) => [
      ...prev,
      {
        char: input.slice(-1),
        textIndicatorPosition,
        currentLineNumber,
        currentCharPosition: input.length - 1,
        errors,
        totalErrors,
        time: Date.now(),
      },
    ]);

    // End Race
    if (input === code) {
      endRace();
    }
  }, [input]);

  async function endRace() {
    if (!startTime) return;
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

    localStorage.setItem(
      "raceTimeStamp",
      JSON.stringify([
        ...raceTimeStamp,
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
          textIndicatorPosition,
          currentLineNumber,
          currentCharPosition: input.length - 1,
          errors,
          totalErrors,
          time: Date.now(),
        },
      ]),
    );

    if (user) {
      const result = await saveUserResultAction({
        timeTaken,
        errors: totalErrors,
        cpm: calculateCPM(code.length - 1, timeTaken),
        accuracy: calculateAccuracy(code.length - 1, totalErrors),
        snippetId: snippet.id,
      });

      router.push(`/result?resultId=${result.id}`);
    } else {
      router.push(`/result?snippetId=${snippet.id}`);
    }
  }

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
    const lines = input.split("\n");
    setCurrentLineNumber(lines.length);
    setReplayTimeStamp((prev) => [
      ...prev,
      {
        char: input.slice(-1),
        textIndicatorPosition,
        currentLineNumber,
        currentCharPosition: input.length - 1,
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
    if (code.charAt(input.length) !== "\n") {
      setInput(input + "\n");
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        return prevTextIndicatorPosition + 1;
      });
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
      setInput(input + "\n" + indent);
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        return prevTextIndicatorPosition + 1 + indent.length;
      });
    }
  }

  function Key(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== code.slice(input.length, input.length + 1)) {
      setTotalErrors((prevTotalErrors) => prevTotalErrors + 1);
    }

    if (e.key === code[input.length] && errors.length === 0 && e.key !== " ") {
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
    }

    setInput((prevInput) => prevInput + e.key);
    setTextIndicatorPosition(
      (prevTextIndicatorPosition) => prevTextIndicatorPosition + 1,
    );
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
      role="none"
    >
      <RaceTracker
        user={user}
        position={textIndicatorPosition}
        codeLength={code.length}
      />
      <Header user={user} snippet={snippet} handleRestart={handleRestart} />
      <section className="flex">
        <LineNumbers code={code} currentLineNumber={currentLineNumber} />
        <Code
          code={code}
          userInput={input}
          textIndicatorPosition={textIndicatorPosition}
          errors={errors}
        />
        <input
          type="text"
          defaultValue={input}
          ref={inputElement}
          onKeyDown={handleKeyboardDownEvent}
          className="absolute inset-y-0 left-0 w-full h-full p-8 rounded-md -z-40 focus:outline outline-blue-500 cursor-none"
          onPaste={(e) => e.preventDefault()}
          data-cy="race-practice-input"
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
