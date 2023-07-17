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
  return (1 - errorsCount / numberOfCharacters) * 100;
}

export default function Race({ user, snippet }: RaceProps) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [input, setInput] = useState("");
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  const [textIndicatorPosition, setTextIndicatorPosition] = useState<
    number | number[]
  >(0);
  const [submittingResults, setSubmittingResults] = useState(false);
  const [totalErrors, setTotalErrors] = useState(0);
  const router = useRouter();
  const inputElement = useRef<HTMLInputElement | null>(null);
  const code = snippet.code.trimEnd();

  const currentText = code.substring(0, input.length);
  const errors = input
    .split("")
    .map((char, index) => (char !== currentText[index] ? index : -1))
    .filter((index) => index !== -1);

  const isRaceFinished = input === code;

  async function endRace() {
    if (!startTime) return;
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

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
    if (!startTime) {
      setStartTime(new Date());
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

    const noopKeys = [
      "Alt",
      "ArrowUp",
      "ArrowDown",
      "Control",
      "Meta",
      "CapsLock",
      "Shift",
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
          break;
        case "ArrowLeft":
          ArrowLeft();
          break;
        case "ArrowRight":
          ArrowRight();
          break;
        case "Tab":
          e.preventDefault();
          Tab();
          break;
        default:
          Key(e);
          break;
      }
    }
  }

  function ArrowRight() {
    if (textIndicatorPosition === input.length) return;

    if (!shiftKeyPressed) {
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          return prevTextIndicatorPosition + 1;
        } else {
          const lastValue = prevTextIndicatorPosition.at(-1) as number;
          return lastValue + 1;
        }
      });
    }

    if (shiftKeyPressed) {
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          const array = [
            prevTextIndicatorPosition + 1,
            prevTextIndicatorPosition,
          ];
          return array;
        } else if (prevTextIndicatorPosition.at(-1) !== input.length) {
          if (prevTextIndicatorPosition.length !== 1) {
            // Since the array's format is in descending order
            // we pop it to get rid of the last value, thus
            // moving the text position forward.
            const array = [...prevTextIndicatorPosition];
            array.pop();
            return array;

            /** Can't find a way to conditionally let it function in
             *  a specific way (right or left).
             */
            // const lastValue = prevTextIndicatorPosition.at(-1) as number;
            // const array = [lastValue + 1, ...prevTextIndicatorPosition];
            // return array;
          } else {
            return prevTextIndicatorPosition[0] + 1;
          }
        } else {
          return prevTextIndicatorPosition;
        }
      });
    }
  }

  function ArrowLeft() {
    if (!shiftKeyPressed) {
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

    if (shiftKeyPressed) {
      setTextIndicatorPosition((prevTextIndicatorPosition) => {
        if (typeof prevTextIndicatorPosition === "number") {
          // if it's still not an array, then convert it to an
          // array when shift key is being held down. Since
          // this function will be called when the ArrowLeft key is
          // pressed/held down.
          const array = [prevTextIndicatorPosition - 1];
          return array;
        } else if (prevTextIndicatorPosition.at(-1) !== 0) {
          // make a shallow copy of the prevTextIndicatorPosition array.
          const array = [...prevTextIndicatorPosition];
          // Get the last value. Add an "as number" to avoid a typescript error
          // as it is expected to not be undefined everytime.
          const lastValue = prevTextIndicatorPosition.at(-1) as number;
          array.push(lastValue - 1);
          return array;
        } else {
          return prevTextIndicatorPosition;
        }
      });
    }
  }

  function Tab() {
    const nextTabStop = 4 - (input.length % 4);
    const tabSpace = " ".repeat(nextTabStop);

    setInput((prevInput) => prevInput + tabSpace);
    setTextIndicatorPosition((prevTextIndicatorPosition) => {
      if (typeof prevTextIndicatorPosition === "number") {
        return prevTextIndicatorPosition + tabSpace.length;
      } else {
        return prevTextIndicatorPosition;
      }
    });
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
          return lastValue;
        }
      });
    }
  }

  function Enter() {
    if (Array.isArray(textIndicatorPosition)) {
      // delete the highlighted text first
      // if the textIndicatorPosition is an array
      Backspace();

      // remove the comment from the return to see
      // it move to a new line
      return;
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
      code[indentLength + newChars.length + input.length + 1] === " "
    ) {
      indentLength++;
    }
    if (indentLength > 0) {
      newChars += " ".repeat(indentLength + 1);
    }

    setInput((prevInput) =>
      (prevInput + newChars).substring(0, code.length - 1),
    );

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
      setTotalErrors(totalErrors + 1);
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
  }

  return (
    <>
      <div
        className="relative flex flex-col w-3/4 gap-2 p-4 rounded-md lg:p-8 bg-accent"
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
        <Code
          code={code}
          errors={errors}
          userInput={input}
          textIndicatorPosition={textIndicatorPosition}
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
        <div className="self-start">
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
        </div>
      </div>

      <RaceDetails submittingResults={submittingResults} />
    </>
  );
}
