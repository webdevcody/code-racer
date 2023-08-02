"use client";

import { useState, useEffect } from "react";
import { PauseIcon, PlayIcon, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplayTimeStamp {
  char: string;
  textIndicatorPosition: number;
  time: number;
}

type ReplayCode = {
  code?: string;
};

export const ReplayCode = ({ code }: ReplayCode) => {
  const [replayTimeStamp, setReplayTimeStamp] = useState<ReplayTimeStamp[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const getReplay = () => {
      return JSON.parse(localStorage.getItem("replayTimeStamp") || "[]");
    };

    const replay = getReplay();
    return setReplayTimeStamp(replay);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPlaying && replayTimeStamp && currentIndex < replayTimeStamp.length) {
      const currentTimestamp = replayTimeStamp[currentIndex];
      const nextTimestampDelay =
        currentIndex + 1 < replayTimeStamp.length
          ? replayTimeStamp[currentIndex + 1].time - currentTimestamp.time
          : null;

      timeout = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, nextTimestampDelay || currentTimestamp.time);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isPlaying, replayTimeStamp]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  if (!code || !replayTimeStamp || replayTimeStamp.length === 0) {
    return null;
  }

  const progress = (currentIndex / (replayTimeStamp.length - 1)) * 100;
  const currentTimestamp = replayTimeStamp[currentIndex];
  if (!currentTimestamp) handleRestart();

  return (
    <div className="py-2 w-full bg-accent text-2xl text-primary relative group">
      <div className="opacity-0 group-hover:opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-2  z-10">
        {isPlaying ? (
          <PauseIcon
            onClick={handlePlayPause}
            className="w-12 h-12 text-primary cursor-pointer"
          />
        ) : (
          <PlayIcon
            onClick={handlePlayPause}
            className="w-12 h-12 text-primary cursor-pointer"
          />
        )}

        <RefreshCcw
          onClick={handleRestart}
          className="w-12 h-12 text-primary cursor-pointer"
        />
      </div>
      <CodeReplay
        code={code}
        character={currentTimestamp?.char}
        textIndicatorPosition={currentTimestamp?.textIndicatorPosition}
      />
      <div className="w-full h-2 bg-secondary mt-2">
        <div
          className="h-full bg-primary rounded"
          style={{
            width: `${progress}%`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

type CodeReplayProps = {
  code: string;
  character: string;
  textIndicatorPosition: number;
};

function CodeReplay({
  code,
  character,
  textIndicatorPosition,
}: CodeReplayProps) {
  const array: number[] = [];
  if (character !== code.charAt(textIndicatorPosition - 1)) {
    array.push(textIndicatorPosition - 1);
  }

  return (
    <>
      <pre className="text-monochrome mb-4 overflow-auto font-medium px-2 w-full">
        {code.split("").map((char, index) => (
          <span
            key={index}
            className={cn("border opacity-50", {
              "text-red-500 opacity-100":
                code[index] !== " " && array.includes(index),
              "border-red-500 opacity-100":
                code[index] === " " && array.includes(index),
              "bg-yellow-200 opacity-80 text-black":
                textIndicatorPosition === index,
            })}
          >
            {char === "\n" ? "⏎\n" : char}
          </span>
        ))}
      </pre>
    </>
  );
}
