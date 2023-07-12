"use client";

import { useState, useEffect, useRef } from "react";
import DisplayedCode from "./displayedCode";
import type { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { saveUserResultAction } from "./actions";
import { useRouter } from "next/navigation";
import RacePositionTracker from "./racePositionTracker";
import { Snippet } from "@prisma/client";

function calculateCPM(
  numberOfCharacters: number,
  secondsTaken: number
): number {
  const minutesTaken = secondsTaken / 60;
  return Math.round(numberOfCharacters / minutesTaken);
}

function calculateAccuracy(
  numberOfCharacters: number,
  errorsCount: number
): number {
  return 1 - errorsCount / numberOfCharacters;
}

interface TypingCodeProps {
  user?: User;
  snippet: Snippet;
}

export default function TypingCode({ user, snippet }: TypingCodeProps) {
  const code = snippet.code;
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [errors, setErrors] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputEl = useRef<HTMLInputElement | null>(null);
  const [isEnd, setIsEnd] = useState(false);
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
        });
    }
    if (inputEl.current !== null) {
      inputEl.current.focus();
    }

    if (isEnd && endTime && startTime) router.push("/result");
  }, [endTime, startTime, user, errors.length, isEnd, router, code.length]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);

    if (!isTyping && event.target.value.length > 0) {
      setStartTime(new Date());
      setIsTyping(true);
    } else if (
      event.target.value === code ||
      event.target.value.length === code.length
    ) {
      setEndTime(new Date());
      setIsTyping(false);
      setIsEnd(true);
    } else {
      setErrors(() => {
        const currentText: string = code.substring(
          0,
          event.target.value.length
        );
        const newErrors: number[] = Array.from(event.target.value)
          .map((char, index) => (char !== currentText[index] ? index : -1))
          .filter((index) => index !== -1);
        console.log(newErrors);
        return newErrors;
      });
    }
  };
  const focusOnCode = () => {
    if (inputEl.current !== null) {
      inputEl.current.focus();
    }
  };
  const handleRestart = () => {
    setInput("");
    setIsTyping(false);
    setStartTime(null);
    setEndTime(null);
    setErrors([]);
  };

  return (
    <div
      className="w-3/4 p-8 bg-accent rounded-md relative"
      onClick={focusOnCode}
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
        ref={inputEl}
        onChange={handleInputChange}
        disabled={endTime !== null}
        className="w-full h-full absolute p-8 inset-y-0 left-0 -z-40 focus:outline outline-blue-500 rounded-md"
      />
      {endTime && startTime && (
        <div>
          <p className="mb-2">
            Time taken: {(endTime.getTime() - startTime.getTime()) / 1000}{" "}
            seconds
          </p>
          <p className="mb-4">Errors: {errors.length}</p>
        </div>
      )}
      <Button onClick={handleRestart}>Restart</Button>
    </div>
  );
}
