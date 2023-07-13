"use client";

import React, { useState, useEffect, useRef } from "react";
import DisplayedCode from "./displayedCode";
import type { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { saveUserResultAction } from "./actions";
import { useRouter } from "next/navigation";
import RacePositionTracker from "./racePositionTracker";
import { Snippet } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface TypingCodeProps {
  user?: User;
  snippet: Snippet;
}

export default function TypingCode({ user, snippet }: TypingCodeProps) {
  const code = snippet.code.trimEnd(); // remove trailing "\n"
  const lines = code.split("\n");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [errors, setErrors] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputElement = useRef<HTMLInputElement | null>(null);
  const [isEnd, setIsEnd] = useState(false);
  const [line, setLine] = useState(1);
  const [counter, setCounter] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (startTime && endTime) {
      const timeTaken: number =
        (endTime.getTime() - startTime.getTime()) / 1000;

      if (user)
        saveUserResultAction({
          userId: user.id,
          timeTaken,
          errors: errors.length,
          cpm: calculateCPM(code.length, timeTaken),
          accuracy: calculateAccuracy(code.length, errors.length),
          snippetId: snippet.id,
        });
    }

    if (inputElement.current !== null) {
      inputElement.current.focus();
    }

    if (isEnd && endTime && startTime) router.push("/result");
  }, [
    endTime,
    startTime,
    user,
    errors.length,
    isEnd,
    code.length,
    router,
    snippet.id,
  ]);

  const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set Values
    setInput(event.target.value);
    setCounter(counter + 1);

    // Check Start
    if (!isTyping && event.target.value.length > 0) {
      setStartTime(new Date());
      setIsTyping(true);
    }

    // Check Newline
    const lineLength = lines[line - 1].length;
    if (lineLength === counter) {
      // Build string
      let s = "";
      for (let i = 0; i < line; i++) {
        s += lines[i] + "\n";
      }

      // Check Array Bounds
      if (line < lines.length) {
        // Calculate Indentation
        let indentWhiteSpace = "";
        for (let i = 0; i <= lines[line].length; i++) {
          if (lines[line].charAt(i) == " ") {
            indentWhiteSpace += " ";
          } else {
            break;
          }
        }

        // Rebuild Input
        let whiteSpaceCreatedOnEnter = "";
        if (s.length - input.length > 0) {
          whiteSpaceCreatedOnEnter = " ".repeat(s.length - input.length);
        }
        const s1 = input + whiteSpaceCreatedOnEnter + indentWhiteSpace;

        // Set Values
        setInput(s1);
        setLine(line + 1);
        setCounter(indentWhiteSpace.length + 1);
      }
    }

    // Set Errors
    setErrors(() => {
      const currentText: string = code.substring(0, event.target.value.length);
      const newErrors: number[] = Array.from(event.target.value)
        .map((char, index) => (char !== currentText[index] ? index : -1))
        .filter((index) => index !== -1);
      return newErrors;
    });

    // Check End
    if (event.target.value.length === code.length) {
      setEndTime(new Date());
      setIsTyping(false);
      setIsEnd(true);
    }
  };

  const handleKeyboardEvent = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Check Backspace Key - Disabled
    if (event.key === "Backspace") {
      event.preventDefault();
    }

    // Check Enter Key
    if (event.key === "Enter") {
      // Reset Character Counter
      setCounter(1);

      // Check Start
      if (!isTyping && input.length > 0) {
        setStartTime(new Date());
        setIsTyping(true);
      }

      // Build string
      let s = "";
      for (let i = 0; i < line; i++) {
        s += lines[i] + "\n";
      }

      // Check Array Bounds
      if (line < lines.length) {
        // Calculate Indentation
        let indentWhiteSpace = "";
        for (let i = 0; i <= lines[line].length; i++) {
          if (lines[line].charAt(i) == " ") {
            indentWhiteSpace += " ";
          } else {
            break;
          }
        }

        // Rebuild Input
        let whiteSpaceCreatedOnEnter = "";
        if (s.length - input.length > 0) {
          whiteSpaceCreatedOnEnter = " ".repeat(s.length - input.length);
        }
        const s1 = input + whiteSpaceCreatedOnEnter + indentWhiteSpace;

        // Set Values
        setInput(s1);
        setLine(line + 1);
        setErrors(() => {
          const currentText: string = code.substring(0, s1.length);
          const newErrors: number[] = Array.from(s1)
            .map((char, index) => (char !== currentText[index] ? index : -1))
            .filter((index) => index !== -1);
          return newErrors;
        });
      }

      //Check Last Line
      if (line == lines.length) {
        // Rebuild Input
        const whiteSpaceCreatedOnEnter = " ".repeat(s.length - input.length);
        const s1 = input + whiteSpaceCreatedOnEnter;

        // Set Values
        setInput(s1);
        setLine(line + 1);
        setErrors(() => {
          const currentText: string = code.substring(0, s1.length);
          const newErrors: number[] = Array.from(s1)
            .map((char, index) => (char !== currentText[index] ? index : -1))
            .filter((index) => index !== -1);
          return newErrors;
        });
      }

      // Check End
      if (s.length - 1 === code.length) {
        setEndTime(new Date());
        setIsTyping(false);
        setIsEnd(true);
      }
    }
  };

  const focusOnLoad = () => {
    if (inputElement.current !== null) {
      inputElement.current.focus();
    }
  };

  const handleRestart = () => {
    setInput("");
    setIsTyping(false);
    setStartTime(null);
    setEndTime(null);
    setErrors([]);
    setLine(1);
    setCounter(1);
  };

  useEffect(() => {
    const handleRestartKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleRestart();
      }
    };
    document.addEventListener("keydown", handleRestartKey);
  }, []);

  return (
    <div
      className="w-3/4 lg:p-8 p-4 bg-accent rounded-md relative"
      onClick={focusOnLoad}
      role="none" // eslint fix - will remove the semantic meaning of an element while still exposing it to assistive technology
    >
      <RacePositionTracker
        inputLength={input.length - errors.length}
        actualSnippetLength={code.length}
        user={user}
      />
      <h1 className="text-2xl font-bold mb-4">Type this code:</h1>
      <DisplayedCode code={code} errors={errors} userInput={input} />
      <input
        type="text"
        value={input}
        ref={inputElement}
        onChange={handleChangeEvent}
        onKeyDown={handleKeyboardEvent}
        disabled={endTime !== null}
        className="w-full h-full absolute p-8 inset-y-0 left-0 -z-40 focus:outline outline-blue-500 rounded-md"
        onPaste={(e) => e.preventDefault()}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleRestart}>Restart</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Press Esc to reset quickly</p>
          </TooltipContent>
          <br />
          <br />
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
