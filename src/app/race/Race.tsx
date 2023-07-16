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
  const [input, setInput] = useState("");

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [counter, setCounter] = useState(0);
  const [line, setLine] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  const [errors, setErrors] = useState<number[]>([]);
  const [errorTotal, setErrorTotal] = useState(0);

  const router = useRouter();

  const code = snippet.code.trimEnd(); // remove trailing "\n"
  const lines = code.split("\n");

  const inputElement = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Debug
    console.log(JSON.stringify(input));
    console.log(JSON.stringify(code));
    // console.log("Lines: " + lines);
    // console.log("Line Number: " + line);
    // console.log("Current Line: " lines[line]);
    // console.log("Line Index: " + lineIndex);
    // console.log("Start Time: " + startTime);
    // console.log("End Time: " + endTime);
    // console.log("ErrorsTotal: " + errorTotal);
    // console.log("Errors: " + errors);

    // Focus element
    if (inputElement.current !== null) {
      inputElement.current.focus();
    }

    // Calculate result
    if (input.length === code.length && input === code && !endTime) {
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
      router.push(`/result?snippetId=${snippet.id}`);
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
    startTime,
    endTime,
    user,
    errors.length,
    errorTotal,
    code.length,
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
  function handleKeyboardEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    setStartTime(new Date());

    if (e.key === "Backspace") {
      Backspace();
    } else if (e.key === "Enter") {
      Enter();
    } else if (e.key === "Shift") {
      e.preventDefault();
    } else if (e.key === "Alt") {
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      // plug in arrow keys here
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      // plug in arrow keys here
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      // plug in arrow keys here
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      // plug in arrow keys here
      e.preventDefault();
    } else if (e.key === "Control") {
      e.preventDefault();
    } else if (e.key === "Tab") {
      e.preventDefault();
      Tab();
    } else if (e.key === "CapsLock") {
      e.preventDefault();
    } else if (e.key === "Escape") {
      e.preventDefault();
    } else {
      Key(e);
      // Check Errors here
    }
  }

  // Tab - Verify
  // if next 2 characters do not equal newline \n move 2 spaces
  //    add to input, update errors
  // if one of the next two characters equals newline \n move to the end of nextline indent
  //    add to input and index, update errors
  function Tab() {
    // Stop at end of line if not matching
    if (input.length === code.length) {
      return;
    }

    setInput(input + "  "); // add 2
    // setInput(input + "    "); // add 4
  }

  // Backspace - Verify
  // if line index does not equal current line indent length
  //     remove 1 from input and index
  // if line index equals current line indent length move to previous line end
  //     subtract indent and newline from input and the index
  function Backspace() {
    if (input.length == 0) {
      setLine(0);
    }
    const ln = lines[line];
    const nextLine = lines[line - 1];
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
      setCounter(nextLine.length - 1);
    } else {
      setInput(input.slice(0, -1));
      if (counter != 0) {
        setCounter(counter - 1);
      }
    }
  }

  // Enter - Verify
  // if enter move to next line at the end of indent
  //     add remainder of current line and indent to input and index, update errors
  function Enter() {
    // Stop at end of line if not matching
    if (input.length - 1 === code.length) {
      return;
    }

    // Check Bounds
    if (line < lines.length) {
      const ln = lines[line];
      const nextLine = lines[line + 1];
      const remainder = calculateRemainder(counter, ln);
      const indent = createIndent(nextLine);

      if (line < lines.length - 1) {
        setInput(input + remainder + indent);
        setLine(line + 1);
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

  // Key Event - Verify
  // if current line index does not equal new line move 1
  //    add to input and index, update errors
  // if current line index equals newline \n move to next line end of indent
  //    add newline and indent to input and index, update errors
  function Key(e: React.KeyboardEvent<HTMLInputElement>) {
    const ln = lines[line];
    const nextLine = lines[line + 1];
    const indent = createIndent(nextLine);

    // Stop at end of line if not matching
    if (input.length === code.length) {
      return;
    }

    if (counter == ln.length - 1) {
      setCounter(indent.length);
      setInput(input + e.key + indent);
      if (line < lines.length - 1) {
        setLine(line + 1);
      }
    } else if (counter - previousLines(lines, line).length == ln.length - 1) {
      setCounter(indent.length);
      setInput(input + e.key + indent);
      if (line < lines.length - 1) {
        setLine(line + 1);
      }
    } else {
      setInput(input + e.key);
      setCounter(counter + 1);
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
      <Code code={code} errors={errors} userInput={input} />
      <input
        type="text"
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
