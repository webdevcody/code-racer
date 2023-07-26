"use client";

import { useState, useEffect } from "react";
import { PauseIcon, PlayIcon, RefreshCcw } from "lucide-react";
import Code from "../race/_components/race/code";

interface replayTimeStampProps {
  char: string;
  textIndicatorPosition: number;
  currentLineNumber: number;
  currentCharPosition: number;
  errors: number[];
  totalErrors: number;
  time: number;
}

export const ReplayCode = ({ code }: { code?: string }) => {
  const [replayTimeStamp, setReplayTimeStamp] = useState<
    replayTimeStampProps[]
  >([]);
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

  const currentTimestamp = replayTimeStamp[currentIndex];

  const progress = (currentIndex / (replayTimeStamp.length - 1)) * 100;

  if (!currentTimestamp) handleRestart();

  return (
    <div className="py-2 w-full bg-accent text-2xl text-primary relative group">
      {/* Buttons */}
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
      <Code
        code={code}
        userInput={currentTimestamp?.char}
        textIndicatorPosition={currentTimestamp?.textIndicatorPosition}
        errors={currentTimestamp?.errors}
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
