"use client";

import React, { useState, useEffect, useRef } from "react";
import type { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Snippet } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heading } from "@/components/ui/heading";
import { saveUserResultAction } from "../_actions/user";
import RaceTracker from "./RaceTracker";
import Code from "./Code";
import RaceTimer from "./race-timer";

interface RaceProps {
  user?: User;
  snippet: Snippet;
}

function calculateCPM(
  numberOfCharacters: number,
  secondsTaken: number,
): number {
  const minutesTaken = secondsTaken / 60;
  return Math.round(numberOfCharacters / minutesTaken);
}

function calculateAccuracy(
  numberOfCharacters: number,
  errorsCount: number,
): number {
  return 1 - errorsCount / numberOfCharacters;
}

export default function Race({ user, snippet }: RaceProps) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [input, setInput] = useState("");
  const router = useRouter();
  const inputElement = useRef<HTMLInputElement | null>(null);
  const code = snippet.code.trimEnd();

  const currentText = code.substring(0, input.length);
  const errors = input
    .split("")
    .map((char, index) => (char !== currentText[index] ? index : -1))
    .filter((index) => index !== -1);

  const errorTotal = errors.length;

  const isRaceFinished = input === code;

  async function endRace() {
    if (!startTime) return;
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

    if (user) {
      await saveUserResultAction({
        timeTaken,
        errors: errorTotal,
        cpm: calculateCPM(code.length - 1, timeTaken),
        accuracy: calculateAccuracy(code.length - 1, errorTotal),
        snippetId: snippet.id,
      });
    }
    router.push(`/result?snippetId=${snippet.id}`);
  }

  useEffect(() => {
    const handleRestartKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleRestart();
      }
    };
    document.addEventListener("keydown", handleRestartKey);
    return () => {
      document.removeEventListener("keydown", handleRestartKey);
    };
  }, []);

  function focusOnLoad() {
    if (inputElement.current !== null) {
      inputElement.current?.focus();
    }
  }

  function handleKeyboardEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    if (isRaceFinished) return;

    const noopKeys = [
      "Shift",
      "Alt",
      "ArrowUp",
      "ArrowDown",
      "ArrowRight",
      "ArrowLeft",
      "Control",
      "Escape",
      "Meta",
    ];

    if (noopKeys.includes(e.key)) {
      e.preventDefault();
    }
    else {
      // Start timer if it isn't already running
      if (!startTime) {
        setStartTime(new Date());
      }

      if (e.key === "Backspace") {
        Backspace();
      } else if (e.key === "Enter") {
        Enter();
      } else {
        Key(e);
      }
    }
    
  }

  // Backspace
  function Backspace() {
    setInput(input.slice(0, -1));
  }

  // Enter
  function Enter() {
    let indentLength = 0;
    let newChars = "";
    // indent until the first newline
    while (
      indentLength + input.length < code.length &&
      code[indentLength + input.length] !== "\n"
    ) {
      indentLength++;
    }
    newChars += " ".repeat(indentLength) + "\n";
    // indent all whitespace
    indentLength = 0;
    while (
      indentLength + newChars.length + input.length + 1 < code.length &&
      code[indentLength + newChars.length + input.length + 1] === " "
    ) {
      indentLength++;
    }
    if (indentLength > 0) {
      newChars += " ".repeat(indentLength + 1);
    }

    const newInput = (input + newChars).substring(0, code.length - 1);
    setInput(newInput);
  }

  function Key(e: React.KeyboardEvent<HTMLInputElement>) {
    const newInput = input + e.key;
    setInput(newInput);

    if (code === newInput) {
      endRace();
    }
  }

  function handleRestart() {
    setStartTime(null);
    setInput("");
  }

  return (
    <div
      className="w-3/4 lg:p-8 p-4 bg-accent rounded-md relative flex flex-col gap-2"
      onClick={focusOnLoad}
      role="none" // eslint fix - will remove the semantic meaning of an element while still exposing it to assistive technology
    >
      <RaceTracker
        codeLength={code.length}
        inputLength={input.length}
        user={user}
      />
      <div className="mb-2 md:mb-4">
        <Heading
          title="Type this code"
          description="Start typing to get racing"
        />
      </div>
      <Code code={code} errors={errors} userInput={input} />
      <input
        type="text"
        // value={input}
        defaultValue={input}
        ref={inputElement}
        onKeyDown={handleKeyboardEvent}
        disabled={isRaceFinished}
        className="w-full h-full absolute p-8 inset-y-0 left-0 -z-40 focus:outline outline-blue-500 rounded-md"
        onPaste={(e) => e.preventDefault()}
      />
      <div className="flex flex-row justify-between">
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
        <RaceTimer startTime={startTime} isRaceFinished={isRaceFinished}/>
      </div>
    </div>
  );
}
