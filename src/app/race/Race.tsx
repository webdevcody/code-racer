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
  calculateRemainder,
  previousLines,
} from "./utils";

import { Heading } from "@/components/ui/heading";
import { saveUserResultAction } from "../_actions/user";
import RaceTracker from "./RaceTracker";
import Code from "./Code";

interface RaceProps {
  user?: User;
  snippet: Snippet;
}

export default function Race({ user, snippet }: RaceProps) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [input, setInput] = useState("");

  const [counter, setCounter] = useState(0);
  const [line, setLine] = useState(0);

  // Keep track of text indicator position
  const [textPosition, setTextPosition] = useState(0);

  // Keep track of shift keyboard
  // On key down, set to true, and on key up, set to false.
  const [shiftKey, setShiftKey] = useState(false);

  const [errors, setErrors] = useState<number[]>([]);
  const [errorTotal, setErrorTotal] = useState(0);

  const router = useRouter();

  const inputElement = useRef<HTMLInputElement | null>(null);
  const code = snippet.code.trimEnd(); // remove trailing "\n"
  const lines = code.split("\n");

  console.log("input: ", input, "position", textPosition);

  useEffect(() => {
    // Debug
    // console.log(JSON.stringify(input));
    // console.log(JSON.stringify(code));
    // console.log(input.length);
    // console.log(code.length);
    // console.log("Index: " + index);
    // console.log("Line Index: " + lineIndex);
    // console.log("Line Number: " + line);
    // console.log(lines[line]);

    // Focus element
    if (inputElement.current !== null) {
      inputElement.current.focus();
    }

    // Calculate result
    if (input.length === code.length && input === code) {
      setEndTime(new Date());
    }
    if (startTime && endTime) {
      const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

      // If logged in
      if (user)
        saveUserResultAction({
          timeTaken,
          // errors: errorTotal,
          errors: errors.length,
          cpm: calculateCPM(code.length - 1, timeTaken),
          accuracy: calculateAccuracy(code.length - 1, errorTotal),
          snippetId: snippet.id,
        });

      router.push("/result");
    }

    // Set Errors
    setErrors(() => {
      const currentText = code.substring(0, input.length);
      const newErrors = Array.from(input)
        .map((char, index) => (char !== currentText[index] ? index : -1))
        .filter((index) => index !== -1);
      return newErrors;
    });
  }, [
    endTime,
    startTime,
    user,
    errors.length,
    errorTotal,
    code.length,
    router,
    snippet.id,
    input,
    code,
  ]);

  // Reset Race
  useEffect(() => {
    const handleRestartKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleRestart();
      }
    };
    document.addEventListener("keydown", handleRestartKey);
  }, []);

  // Focus On Load
  function focusOnLoad() {
    if (inputElement.current !== null) {
      inputElement.current.focus();
    }
  }

  // Key Events - Enabled / Disable / Support Func
  function handleKeyboardDownEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    setStartTime(new Date());
    switch (e.key) {
      case "Backspace":
        Backspace();
        break;
      case "Enter":
        Enter();
        break;
      case "Escape":
        handleRestart();
        break;
      case "ArrowLeft":
        ArrowLeft();
        break;
      case "ArrowRight":
        ArrowRight();
        break;
      case "ArrowUp":
      case "ArrowDown":
        e.preventDefault();
        break;
      case "Shift":
        Shift("keydown");
        break;
      case "Alt":
        e.preventDefault();
        break;
      case "Control":
        e.preventDefault();
        break;
      default:
        Key(e);
        // Check Errors here
        break;
    };
  }

  function handleKeyboardUpEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Shift":
        Shift("keyup");
        break;
    };
  };

  // Shift
  function Shift(type: "keyup" | "keydown") {
    const state = type === "keydown"
      ? true
      : false;
    setShiftKey(state);
  };

  // ArrowRight
  function ArrowRight() {
    // if (line < lines.length - 1) {
    //   setLine(line + 1);
    // }

    // Only activate if position is currently not equal to the last character of the input.
    if (textPosition < input.length) {
      setTextPosition((prevPosition) => prevPosition + 1);
    };
  };

  // ArrowLeft
  function ArrowLeft() {
    if (line > 0) {

    } else {
      // Code for first line
      if (textPosition !== 0) {
        setTextPosition((prevPosition) => prevPosition - 1);
      };
    }
  };

  // Backspace
  function Backspace() {
    const ln = lines[line];
    const nextLine = lines[line - 1];
    const indent = createIndent(ln);
    const array = input.split("");

    // if the user has not pressed ArrowLeft
    if (textPosition === input.length) {
      // State what this if statement code does
      if (array.lastIndexOf("\n") == input.length - 1) {
        setInput((prevInput) => prevInput.slice(0, -2));
        setTextPosition((prevPosition) => prevPosition - 2);
        if (line != 0) {
          setLine((prevLine) => prevLine - 1);
        }
        if (counter != 0) {
          setCounter(indent.length - ln.length);
        }
      } else if (array.lastIndexOf("\n") == input.length - indent.length - 1) {
        setInput((prevInput) => prevInput.slice(0, -2 - indent.length));
        // 4 is the amount reduced in the input.length when pressing backspace
        // to a previous line.
        setTextPosition((prevPosition) => prevPosition - 4);
        if (line != 0) {
          setLine((prevLine) => prevLine - 1);
        }
        setCounter(nextLine.length - 1);
      } else {
        // Deletes previous character
        setInput((prevInput) => prevInput.slice(0, -1));
        // set position
        if (textPosition !== 0) {
          setTextPosition((prevPosition) => prevPosition - 1);
        }
        if (counter != 0) {
          setCounter((prevCount) => prevCount + 1);
        }
      }
    }

    // If the user has pressed the ArrowLeft key
    if (textPosition < input.length) {
      const newInput = array.filter((char, index) => {
        if (index !== textPosition - 1) {
          return char;
        }
      });
      setInput(newInput.join(""));
      setTextPosition((prevPosition) => prevPosition - 1);
    }

    // to not go below 0
    if (textPosition === 0) {
      setTextPosition(0);
    }
  }

  // Enter
  function Enter() {
    // Stop at end of line if not matching
    if (input.length - 1 === code.length) {
      return;
    }

    if (line < lines.length) {
      const ln = lines[line];
      const nextLine = lines[line + 1];
      const remainder = calculateRemainder(counter, ln);
      const indent = createIndent(nextLine);

      if (line < lines.length - 1) {
        setInput((prevInput) => prevInput + remainder + indent);

        setTextPosition((prevPosition) => prevPosition + remainder.length + indent.length);

        setLine((prevLine) => prevLine + 1);
      }

      setCounter(indent.length);
      setErrors(() => {
        const currentText = code.slice(0, (input + remainder + indent).length);
        const newErrors = Array.from(input + remainder + indent)
          .map((char, index) => (char !== currentText[index] ? index : -1))
          .filter((index) => index !== -1);
        return newErrors;
      });
    }
  }

  // Default
  function Key(e: React.KeyboardEvent<HTMLInputElement>) {
    const ln = lines[line];
    const nextLine = lines[line + 1];
    const indent = createIndent(nextLine);

    // Stop at end of line if not matching
    if (input.length - 1 === code.length) {
      return;
    }

    // If the user has not moved the text indicator
    if (textPosition === input.length) {
      if (counter == (ln.length - 1) || (ln.length - 1) == counter - previousLines(lines, line).length) {
        setCounter(indent.length);
        setInput((prevInput) => prevInput + e.key + "\n" + indent);
        if (line < lines.length - 1) {
          setLine((prevLine) => prevLine + 1);
        }
        // 2 is equal to e.key and "\n".
        setTextPosition((prevPosition) => prevPosition + 2 + indent.length);
      } else {
        setInput((prevInput) => prevInput + e.key);
        setCounter((prev) => prev + 1);

        // set text position
        setTextPosition((prevPosition) => prevPosition + 1);
      }
    }

    if (textPosition < input.length) {
      const array: string[] = [];

      // for each index of the input's length, check if
      // the index is === textPosition, then append
      // the pressed key to the array and add the
      // following character after it.
      for (let i = 0; i < input.length; i++) {
        if (i === textPosition) {
          array.push(e.key);
          array.push(input[i]);
        } else {
          array.push(input[i]);
        }
      };

      setInput(array.join(""));
      setTextPosition((prevPosition) => prevPosition + 1);
    }
  }

  // Reset Race Values
  function handleRestart() {
    setStartTime(null);
    setEndTime(null);
    setInput("");
    setLine(0);
    setCounter(0);
    setErrorTotal(0);
    setErrors([]);
    setTextPosition(0);
  }

  return (
    <div
      className="w-3/4 lg:p-8 p-4 bg-accent rounded-md relative"
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
      <Code code={code} errors={errors} userInput={input} textPosition={textPosition} />
      <input
        type="text"
        // value={input}
        defaultValue={input}
        ref={inputElement}
        onKeyDown={handleKeyboardDownEvent}
        onKeyUp={handleKeyboardUpEvent}
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
