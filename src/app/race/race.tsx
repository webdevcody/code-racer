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
import RaceTracker from "./race-tracker";
import Code from "./code";
import { saveUserResultAction } from "../_actions/result";
import RaceDetails from "./_components/race-details";
import RaceTimer from "./race-timer";
import { ReportButton } from "./_components/report-button";

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
  return (1 - errorsCount / numberOfCharacters) * 100;
}

interface raceTimeStampProps {
  char: string;
  accuracy: number;
  cpm: number;
  time: number;
}

interface replayTimeStampProps {
  char: string;
  textIndicatorPosition: number | number[];
  currentLineNumber: number;
  currentCharPosition: number;
  errors: number[];
  totalErrors: number;
  time: number;
}

export default function Race({
  user,
  snippet,
}: {
  user?: User;
  snippet: Snippet;
}) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [input, setInput] = useState("");
  const [textIndicatorPosition, setTextIndicatorPosition] = useState<
    number | number[]
  >(0);
  const [submittingResults, setSubmittingResults] = useState(false);
  const [totalErrors, setTotalErrors] = useState(0);
  const [currentLineNumber, setCurrentLineNumber] = useState(0);
  const [currentCharPosition, setCurrentCharPosition] = useState(0);
  const router = useRouter();
  const inputElement = useRef<HTMLInputElement | null>(null);
  const code = snippet.code.trimEnd();

  const currentText = code.substring(0, input.length);
  const errors = input
    .split("")
    .map((char, index) => (char !== currentText[index] ? index : -1))
    .filter((index) => index !== -1);

  const isRaceFinished = input === code;
  const showRaceTimer = !!startTime && !isRaceFinished;
  const [currentChar, setCurrentChar] = useState("");
  const [raceTimeStamp, setRaceTimeStamp] = useState<raceTimeStampProps[]>([]);
  const [replayTimeStamp, setReplayTimeStamp] = useState<replayTimeStampProps[]>([]);

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

    if (user) {
      const result = await saveUserResultAction({
        timeTaken,
        errors: totalErrors,
        cpm: calculateCPM(code.length - 1, timeTaken),
        accuracy: calculateAccuracy(code.length - 1, totalErrors),
        snippetId: snippet.id,
      });

      if (!result.data) {
        return router.refresh();
      }

      router.push(`/result?resultId=${result.data.id}`);
    } else {
      router.push(`/result`);
    }

    setSubmittingResults(false);
  }

  // Check if race is finished
  useEffect(() => {
    if (isRaceFinished) {
      endRace();
    }
    focusOnLoad();

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
      }
    ]);
  }, [input]);

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

  function handleKeyboardDownEvent(e: React.KeyboardEvent<HTMLInputElement>) {
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

    const noopKeys = [
      "Alt",
      "ArrowUp",
      "ArrowDown",
      "Control",
      "Meta",
      "CapsLock",
      "Shift",
      "altGraphKey", // - Please confirm I am unable to test this
      "AltGraph", // - Please confirm I am unable to test this
      "ContextMenu",
      "Insert",
      "Delete",
      "PageUp",
      "PageDown",
      "Home",
      "OS",
      "NumLock",
    ];

    if (noopKeys.includes(e.key)) {
      e.preventDefault();
    } else {
      switch (e.key) {
        case "Backspace":
          Backspace();
          break;
        case "Enter":
          Enter();
          if (!startTime) {
            setStartTime(new Date());
          }
          break;
        case "ArrowLeft":
          ArrowLeft(e);
          break;
        case "ArrowRight":
          ArrowRight(e);
          break;
        case "Tab":
          e.preventDefault();
          Tab();
          if (!startTime) {
            setStartTime(new Date());
          }
          break;
        default:
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
      }
    ]);
  }

  function ArrowRight(e: React.KeyboardEvent<HTMLInputElement>) {
    if (textIndicatorPosition === input.length) return;

    // if text is highlighted, set the text position
    // after the last value of the array.
    // e.g [3, 2, 1], will set the text position to 2 because it's the second value before the last index.
    if (!e.shiftKey) {
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          return prevTextIndicatorPosition + 1;
        } else {
          const secondToLastValue = prevTextIndicatorPosition[prevTextIndicatorPosition?.length - 2] ?? prevTextIndicatorPosition;
          return secondToLastValue;
        }
      });
    }

    if (e.ctrlKey && e.key === "ArrowRight") {
      if (textIndicatorPosition === input.length) {
        return;
      }
      let i = textIndicatorPosition as number;
      while (i < input.length) {
        if (typeof textIndicatorPosition === "number") {
          if (code.charAt(i + 1) !== " " && code.charAt(i) === " ") {
            setTextIndicatorPosition(i + 1);
            break;
          }
        }
        i++;
      }
    }

    if (e.shiftKey && e.key === "ArrowRight") {
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          const array = [prevTextIndicatorPosition + 1];
          return array;
        } else {
          const lastValue = prevTextIndicatorPosition?.at(-1) as number;
          // if the current state of the highlighted text is in descending order,
          // then that means the array was formed with the left arrow key plus shift key.
          if (lastValue < prevTextIndicatorPosition[0]) {
            const array = [...prevTextIndicatorPosition];
            array.pop();
            return array;
          } else if (lastValue >= prevTextIndicatorPosition[0]) {
            if (lastValue === input.length) {
              return prevTextIndicatorPosition
            } else {
              const array = [...prevTextIndicatorPosition];
              const lastValue = prevTextIndicatorPosition.at(-1) as number;
              array.push(lastValue + 1);
              return array;
            }
          } else {
            return prevTextIndicatorPosition;
          }
        }
      });
    }
  }

  function ArrowLeft(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!e.shiftKey) {
      if (textIndicatorPosition !== 0) {
        setTextIndicatorPosition((prevTextIndicatorPosition) => {
          if (typeof prevTextIndicatorPosition === "number") {
            return prevTextIndicatorPosition - 1;
          } else {
            const lastValue = prevTextIndicatorPosition.at(-1) as number;
            return lastValue !== 0 ? lastValue - 1 : lastValue;
          }
        });
      }
    }

    if (e.ctrlKey && e.key === "ArrowLeft") {
      let n = 0;
      let i = textIndicatorPosition as number;
      while (i > 0) {
        if (typeof textIndicatorPosition === "number") {
          if (code.charAt(i - 1) !== " " && code.charAt(i) === " ") {
            n = textIndicatorPosition - i;
            setTextIndicatorPosition((prevTextIndicatorPosition) =>
              typeof prevTextIndicatorPosition === "number"
                ? prevTextIndicatorPosition - n - 1
                : prevTextIndicatorPosition,
            );
            break;
          }
        }
        i--;
      }
    }

    if (e.shiftKey && e.key === "ArrowLeft") {
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          // if it's still not an array, then convert it to an
          // array when shift key is being held down. Since
          // this function will be called when the ArrowLeft key is
          // pressed/held down.
          const array = [prevTextIndicatorPosition - 1];
          return array;
        } else {
          const lastValue = prevTextIndicatorPosition?.at(-1) as number;
          // if the current state of the highlighted text is in descending order,
          // then that means the array was formed with the left arrow key plus shift key.
          if (lastValue > prevTextIndicatorPosition[0]) {
            const array = [...prevTextIndicatorPosition];
            array.pop();
            return array;
          } else if (lastValue <= prevTextIndicatorPosition[0]) {
            if (lastValue === input.length) {
              return prevTextIndicatorPosition
            } else {
              const array = [...prevTextIndicatorPosition];
              const lastValue = prevTextIndicatorPosition?.at(-1) as number;
              if (lastValue === 0) {
                return array;
              } else {
                array.push(lastValue - 1);
                return array;
              }
            }
          } else {
            return prevTextIndicatorPosition;
          }
        }
      });
    }
  }

  function Tab() {
    // if the more than one text is highlighted, remove the highlighted text.
    if (Array.isArray(textIndicatorPosition)) {
      Backspace();
    }

    if (code.slice(input.length, input.length + 4).includes("\n")) {
      let indentLength = 0;
      let newChars = "";
      while (
        indentLength + input.length < code.length &&
        code[indentLength + input.length] !== "\n"
      ) {
        indentLength++;
      }
      newChars += " ".repeat(indentLength) + "\n";
      indentLength = 0;
      while (
        indentLength + newChars.length + input.length + 1 < code.length &&
        code[indentLength + newChars.length + input.length] === " "
      ) {
        indentLength++;
      }
      if (indentLength >= 0) {
        newChars += " ".repeat(indentLength);
      }
      setInput((prevInput) => prevInput + newChars);
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          return prevTextIndicatorPosition + newChars.length;
        } else {
          return prevTextIndicatorPosition;
        }
      });
    } else {
      let tabSpace = "";
      const counter = currentCharPosition;
      const nextTabStop = 4 - (counter % 4);
      tabSpace = " ".repeat(nextTabStop);

      setInput((prevInput) => prevInput + tabSpace);
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          return prevTextIndicatorPosition + tabSpace.length;
        } else {
          return prevTextIndicatorPosition;
        }
      });
    }
  }
  
  function Backspace() {
    if (textIndicatorPosition === input.length) {
      setInput((prevInput) => prevInput.slice(0, -1));
    }

    if (
      !Array.isArray(textIndicatorPosition) &&
      textIndicatorPosition < input.length
    ) {
      const inputArray = input.split("");
      // Filter out the the character to be deleted based on where the current text
      // indicator is located. Subtract the position by one since we are comparing them
      // through an array's index.
      const newArray = inputArray.filter((char, index) => {
        if (index !== textIndicatorPosition - 1) return char;
      });
      setInput(newArray.join(""));
    }

    if (textIndicatorPosition !== 0) {
      if (Array.isArray(textIndicatorPosition)) {
        const inputArray = input.split("");

        // This is a double loop, so open for refactoring.
        const newArray = inputArray.filter((char, index) => {
          for (let i = 0; i < textIndicatorPosition.length; i++) {
            // loop through each position stored in the textIndicatorPosition
            // array, and check if it's equal to any of the index in the inputArray.
            if (textIndicatorPosition[i] === index) {
              return null;
            }
          }
          return char;
        });

        setInput(newArray.join(""));
      }

      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          return prevTextIndicatorPosition - 1;
        } else {
          const lastValue = prevTextIndicatorPosition.at(-1) as number;
          if (lastValue > prevTextIndicatorPosition[0]) {
            return prevTextIndicatorPosition[0];
          } else {
            return lastValue;
          }
        }
      });
    }

    if (raceTimeStamp.length > 0 && errors.length == 0) {
      setRaceTimeStamp((prev) => prev.slice(0, -1));
    }
  }

  function Enter() {
    if (Array.isArray(textIndicatorPosition)) {
      Backspace();
    }

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
      code[indentLength + newChars.length + input.length] === " "
    ) {
      indentLength++;
    }
    if (indentLength >= 0) {
      newChars += " ".repeat(indentLength);
    }

    setInput((prevInput) => prevInput + newChars);

    setTextIndicatorPosition((prevTextIndicatorPosition) => {
      if (typeof prevTextIndicatorPosition === "number") {
        return prevTextIndicatorPosition + newChars.length;
      } else {
        return prevTextIndicatorPosition;
      }
    });
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
      setCurrentChar("");
    }

    if (!Array.isArray(textIndicatorPosition)) {
      if (textIndicatorPosition === input.length) {
        setInput((prevInput) => prevInput + e.key);
      }

      if (textIndicatorPosition < input.length) {
        const inputArray: string[] = [];

        /**
         * Loop through each of the input's total length, then
         * if the current loop we are in is === to the textIndicator's position,
         * insert the pressed key there and also the current character that
         * was originally in that position.
         */
        for (let i = 0; i < input.length; i++) {
          if (i === textIndicatorPosition) {
            inputArray.push(e.key);
            inputArray.push(input[i]);
          } else {
            inputArray.push(input[i]);
          }
        }
        setInput(inputArray.join(""));
      }
    }

    if (Array.isArray(textIndicatorPosition)) {
      Backspace();
      setInput((prevInput) => prevInput + e.key);
    }

    setTextIndicatorPosition((prevTextIndicatorPosition) => {
      if (typeof prevTextIndicatorPosition === "number") {
        return prevTextIndicatorPosition + 1;
      } else {
        return prevTextIndicatorPosition;
      }
    });
  }

  function handleRestart() {
    setStartTime(null);
    setInput("");
    setTextIndicatorPosition(0);
    setTotalErrors(0);
  }

  return (
    <>
      <div
        className="relative flex flex-col gap-2 p-4 rounded-md lg:p-8 bg-accent w-3/4 mx-auto"
        onClick={focusOnLoad}
        role="none" // eslint fix - will remove the semantic meaning of an element while still exposing it to assistive technology
      >
        <RaceTracker
          codeLength={code.length}
          inputLength={input.length}
          user={user}
        />
        <div className="mb-2 md:mb-4 flex justify-between">
          <Heading
            title="Type this code"
            description="Start typing to get racing"
          />
          {user && (
            <ReportButton
              snippetId={snippet.id}
              // userId={user.id}
              language={snippet.language}
            />
          )}
        </div>
        <div className="flex ">
          <div className="flex-col px-1 w-10 ">
            {code.split("\n").map((index, line) => (
              <div
                key={line}
                className={
                  currentLineNumber === line + 1
                    ? // && textIndicatorPosition
                    "text-center bg-slate-600  border-r-2 border-yellow-500"
                    : " text-center border-r-2 border-yellow-500"
                }
              >
                {line + 1}
              </div>
            ))}
          </div>

          <Code
            code={code}
            errors={errors}
            userInput={input}
            currentLineNumber={currentLineNumber}
            currentCharPosition={currentCharPosition}
            textIndicatorPosition={textIndicatorPosition}
            totalErrors={totalErrors}
          />
          <input
            type="text"
            defaultValue={input}
            ref={inputElement}
            onKeyDown={handleKeyboardDownEvent}
            disabled={isRaceFinished}
            className="absolute inset-y-0 left-0 w-full h-full p-8 rounded-md -z-40 focus:outline outline-blue-500"
            onPaste={(e) => e.preventDefault()}
          />
        </div>
        {verifyErrors(errors)}
        <div className="flex justify-between items-center">
          {showRaceTimer && (
            <>
              <RaceTimer />
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

function verifyErrors(errors: number[]) {
  if (errors.length > 0) {
    return (
      <span className="text-red-500">
        You must fix all errors before you can finish the race!
      </span>
    );
  }
}
