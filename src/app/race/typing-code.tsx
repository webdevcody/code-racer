"use client";

import React, { useState, useEffect, useRef } from "react";
import DisplayedCode from "./displayed-code";
import type { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { saveUserResultAction } from "../_actions/user";
import { useRouter } from "next/navigation";
import RacePositionTracker from "./race-position-tracker";
import { Snippet } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heading } from "@/components/ui/heading";

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

    if (isEnd && endTime && startTime)
      router.push(`/result?snippetId=${snippet.id}`);
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
    if (lineLength <= counter) {
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

  const enterKeyEffect = () => {
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
  };

  const handleKeyboardEvent = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    switch (event.key) {
      case "Backspace":
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        break;
      case "Enter":
        enterKeyEffect();
        break;
    };
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
      className="relative w-full p-4 overflow-x-auto rounded-md md:w-3/4 lg:p-8 bg-accent"
      onClick={focusOnLoad}
      role="none" // eslint fix - will remove the semantic meaning of an element while still exposing it to assistive technology
    >
      <RacePositionTracker
        inputLength={input.length - errors.length}
        actualSnippetLength={code.length}
        user={user}
      />

      {/* <h1 className="mb-4 text-2xl font-bold">Type this code:</h1> */}
      <div className="mb-2 md:mb-4">
        <Heading
          title="Type this code"
          description="Start typing to get racing"
        />
      </div>
      <DisplayedCode code={code} errors={errors} userInput={input} isCurrentLineEmpty={(lines[line - 1]?.length ?? -1 ) === 0}/>
      <input
        type="text"
        value={input}
        ref={inputElement}
        onChange={handleChangeEvent}
        onKeyDown={handleKeyboardEvent}
        disabled={endTime !== null}
        className="absolute inset-y-0 left-0 w-full h-full p-8 rounded-md -z-40 focus:outline outline-blue-500"
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
