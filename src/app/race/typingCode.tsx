"use client";

import { useState, useEffect } from "react";
import DisplayedCode from "./displayedCode";
import type { User } from "next-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveUserResult } from "./actions";

const code = `printf("hello world")`;

function calculateWPM() {
  return 1;
}

function calculateAccuracy() {
  return 92.2;
}

interface TypingCodeProps {
  user?: User;
}

export default function TypingCode({ user }: TypingCodeProps) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [errors, setErrors] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (startTime && endTime) {
      const timeTaken: number =
        (endTime.getTime() - startTime.getTime()) / 1000;

      if (user)
        saveUserResult({
          userId: user.id,
          timeTaken,
          errors: errors.length,
          wpm: calculateWPM(),
          accuracy: calculateAccuracy(),
        });

      console.log("Time taken:", timeTaken);
    }
  }, [endTime, startTime, user, errors.length]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);

    if (!isTyping && event.target.value.length > 0) {
      setStartTime(new Date());
      setIsTyping(true);
    } else if (event.target.value === code) {
      setEndTime(new Date());
      setIsTyping(false);
    } else {
      setErrors(() => {
        const currentText: string = code.substring(
          0,
          event.target.value.length
        );
        const newErrors: number[] = Array.from(event.target.value)
          .map((char, index) => (char !== currentText[index] ? index : -1))
          .filter((index) => index !== -1);
        return newErrors;
      });
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
    <div className="w-3/4 p-8 bg-accent rounded-md">
      <h1 className="text-2xl font-bold mb-4">Type this code:</h1>
      <DisplayedCode code={code} errors={errors} />
      <Input
        type="text"
        value={input}
        onChange={handleInputChange}
        disabled={endTime !== null}
        className="w-full p-2 border border-border rounded mb-4"
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
