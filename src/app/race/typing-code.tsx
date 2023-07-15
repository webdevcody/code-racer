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
import {
  calculateAccuracy,
  calculateCPM,
  createIndent,
  calculateLineRemainder,
  buildString,
} from "./utils";

import { Heading } from "@/components/ui/heading";
import { saveUserResultAction } from "../_actions/user";
import RacePositionTracker from "./race-position-tracker";
import DisplayedCode from "./displayed-code";

interface TypingCodeProps {
  user?: User;
  snippet: Snippet;
}

export default function TypingCode({ user, snippet }: TypingCodeProps) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [errorTotal, setErrorTotal] = useState(0);
  const [input, setInput] = useState("");

  const [counter, setCounter] = useState(0);
  const [line, setLine] = useState(0);
  const router = useRouter();

  const [errors, setErrors] = useState<number[]>([]);
  const [index, setIndex] = useState(0);

  const inputElement = useRef<HTMLInputElement | null>(null);
  const code = snippet.code.trimEnd(); // remove trailing "\n"
  const lines = code.split("\n");

  useEffect(() => {
    // Focus element
    if (inputElement.current !== null) {
      inputElement.current.focus();
    }

    // Calculate result
    if (startTime && endTime) {
      const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

      // if logged in
      if (user)
        saveUserResultAction({
          userId: user.id,
          timeTaken,
          errors: errorTotal,
          cpm: calculateCPM(code.length - 1, timeTaken),
          accuracy: calculateAccuracy(code.length - 1, errorTotal),
          snippetId: snippet.id,
        });

      // Result
      if (input.length - 1 === code.length - 1 && input === code) {
        setEndTime(new Date());
        router.push("/result");
      }
    }
    setErrors(() => {
      const currentText = code.substring(0, input.length);
      const newErrors = Array.from(input)
        .map((char, index) => (char !== currentText[index] ? index : -1))
        .filter((index) => index !== -1);
      console.log(newErrors);
      return newErrors;
    });
  }, [
    endTime,
    startTime,
    user,
    errorTotal,
    code.length,
    router,
    snippet.id,
    input,
    code,
  ]);

  useEffect(() => {
    const handleRestartKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleRestart();
      }
    };
    document.addEventListener("keydown", handleRestartKey);
  }, []);

  function focusOnLoad() {
    if (inputElement.current !== null) {
      inputElement.current.focus();
    }
  }

  function handleKeyboardEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    setStartTime(new Date());

    if (e.key === "Backspace") {
      Back();
    } else if (e.key === "Enter") {
      Enter();
    } else if (e.key === "Shift") {
      e.preventDefault();
    } else if (e.key === "Alt") {
      e.preventDefault();
    } else if (e.key === "Control") {
      e.preventDefault();
    } else if (e.key === "Escape") {
      e.preventDefault();
    } else {
      KeyStroke(e);
    }
  }

  function Back() {
    const ln = lines[line];
    const pln = lines[line - 1];
    const indent = createIndent(ln);

    const array = input.split("");
    if (array.lastIndexOf("\n") == input.length - 1) {
      setInput(input.slice(0, -2));
      if (line != 0) {
        setLine(line - 1);
      }
      if (counter != 0) {
        setCounter(indent.length - ln.length);
      }
    } else if (array.lastIndexOf("\n") == input.length - indent.length - 1) {
      setInput(input.slice(0, -2 - indent.length));
      if (line != 0) {
        setLine(line - 1);
      }
      setCounter(pln.length - 1);
    } else {
      setInput(input.slice(0, -1));

      if (counter != 0) {
        setCounter(counter - 1);
      }
    }
    setIndex(index - 1);
  }

  function Enter() {
    if (line < lines.length) {
      const ln = lines[line];
      const nextLine = lines[line + 1];
      const remainingCharactersOfLine = calculateLineRemainder(counter, ln);

      const indent = createIndent(nextLine);

      if (line < lines.length - 1) {
        setInput(input + remainingCharactersOfLine + indent);
        setLine(line + 1);
      }
      setCounter(indent.length);
      setErrors(() => {
        const currentText = code.slice(
          0,
          (input + remainingCharactersOfLine + indent).length,
        );
        // const currentText = input;
        const newErrors = Array.from(input + remainingCharactersOfLine + indent)
          .map((char, index) => (char !== currentText[index] ? index : -1))
          .filter((index) => index !== -1);
        console.log(newErrors);
        return newErrors;
      });
    }

    if (input.length == code.length - 1) {
      router.push("/result");
    }
  }

  function KeyStroke(e: React.KeyboardEvent<HTMLInputElement>) {
    const character = e.key;
    const ln = lines[line];
    const nextLine = lines[line + 1];
    const indent = createIndent(nextLine);
    const s = character + "\n" + indent;

    if (counter == ln.length - 1) {
      setCounter(indent.length);
      setInput(input + s);
      if (line < lines.length - 1) {
        setLine(line + 1);
      }
      setIndex(index + indent.length + 2);
    } else if (ln.length - 1 == counter - buildString(lines, line).length) {
      setCounter(indent.length);
      setInput(input + s);
      if (line < lines.length - 1) {
        setLine(line + 1);
      }
      setIndex(index + indent.length);
    } else {
      setInput(input + character);
      setCounter(counter + 1);
      setIndex(index + 1);
    }

    if (input.length == code.length - 1) {
      router.push("/result");
    }
  }

  function handleRestart() {
    setStartTime(null);
    setEndTime(null);
    setInput("");
    setErrorTotal(0);
    setLine(0);
    setCounter(0);
  }

  return (
    <div
      className="w-3/4 lg:p-8 p-4 bg-accent rounded-md relative"
      onClick={focusOnLoad}
      role="none" // eslint fix - will remove the semantic meaning of an element while still exposing it to assistive technology
    >
      <RacePositionTracker
        codeLength={code.length}
        inputLength={input.length}
        user={user}
      />
      {/* <h1 className="text-2xl font-bold mb-4">Type this code:</h1> */}
      <div className="mb-2 md:mb-4">
        <Heading
          title="Type this code"
          description="Start typing to get racing"
        />
      </div>
      <DisplayedCode code={code} errors={errors} userInput={input} />
      <input
        type="text"
        // value={input}
        defaultValue={input}
        ref={inputElement}
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
            <p>Press Esc to reset</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
