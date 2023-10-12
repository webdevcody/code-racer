"use client";

import type { chartTimeStamp } from "../main-content";

import React from "react";
import { PauseIcon, PlayIcon, RefreshCcwIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

type Props = {
  timeStamp: chartTimeStamp;
};

const ReplayCard: React.FC<Props> = React.memo(({ timeStamp }) => {
  const [playState, setPlayState] = React.useState<"play" | "pause">("pause");
  const [currentTimeStamp, setCurrentTimeStamp] = React.useState(-1);

  const wordPerSecond = React.useMemo(
    () =>
      Math.floor(
        (timeStamp[timeStamp.length - 1].time / timeStamp.length) * 1000
      ),
    [timeStamp]
  );

  const interval = React.useRef<NodeJS.Timer | null>(null);

  React.useEffect(() => {
    const REPLAY_FINISHED_SNIPPET = currentTimeStamp >= timeStamp.length - 1;
    if (REPLAY_FINISHED_SNIPPET) {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
        setPlayState("pause");
      }
    }
  }, [currentTimeStamp, timeStamp]);

  return (
    <React.Fragment>
      <div className="flex flex-col gap-8">
        <Heading
          typeOfHeading="h2"
          size="h2"
          title="Replay"
          description="Watch as a ghost copies your typing speed."
        />

        <div className="group relative bg-secondary/60 dark:bg-secondary/60 dark:border-2 shadow-md shadow-black/20 rounded-lg p-4 lg:p-8 min-h-[20rem]">
          <div className="min-h-[15rem]">
            <code id="replay-card" data-cy="replay-card">
              <pre className="overflow-auto break-words whitespace-pre-wrap">
                {currentTimeStamp >= 0 ? (
                  <Character code={timeStamp[currentTimeStamp].word} />
                ) : (
                  <p className="text-slate-500/80">
                    Press play to see your ghost type...
                  </p>
                )}
              </pre>
            </code>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out absolute w-full h-full inset-0 m-auto flex items-end bg-gradient-to-t from-black/80 to-transparent rounded-lg">
            <div className="p-4 flex items-center gap-1">
              <Button
                size="icon"
                className="p-1 h-auto"
                variant="ghost"
                aria-controls="replay-card"
                aria-label="Play or Pause Your Typing Replay"
                title="Play or Pause Your Typing Replay"
                data-cy="play-pause-replay-card-button"
                onClick={() => {
                  if (playState === "pause") {
                    const REPLAY_FINISHED_SNIPPET =
                      currentTimeStamp >= timeStamp.length - 1;

                    if (!interval.current) {
                      if (REPLAY_FINISHED_SNIPPET) {
                        setCurrentTimeStamp(0);
                      }
                      interval.current = setInterval(() => {
                        setCurrentTimeStamp((currentTimeStamp) => {
                          return currentTimeStamp + 1;
                        });
                      }, wordPerSecond);
                    }
                  } else if (playState === "play") {
                    if (interval.current) {
                      clearInterval(interval.current);
                      interval.current = null;
                    }
                  }
                  setPlayState((p) => (p === "pause" ? "play" : "pause"));
                }}
              >
                <span>
                  {playState === "pause" && <PlayIcon className="w-8 h-8" />}
                  {playState === "play" && <PauseIcon className="w-8 h-8" />}
                </span>
              </Button>

              <Button
                size="icon"
                className="p-1 h-auto"
                variant="ghost"
                aria-controls="replay-card"
                aria-label="Restart Replay"
                title="Restart Replay"
                data-cy="restart-replay-card-button"
                onClick={() => {
                  setPlayState("pause");
                  setCurrentTimeStamp(-1);
                  if (interval.current) {
                    clearInterval(interval.current);
                    interval.current = null;
                  }
                }}
              >
                <RefreshCcwIcon className="w-8 h-8" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});

type CharProps = {
  code: string;
  amountInRecursion?: number;
};

const Character: React.FC<CharProps> = ({ code, amountInRecursion = 0 }) => {
  return (
    <React.Fragment>
      <span>{code.charAt(amountInRecursion)}</span>
      {amountInRecursion === code.length && (
        <span className="animate-blink bg-yellow-400 dark:bg-yellow-300 opacity-90 dark:opacity-80 text-black">
          {" "}
        </span>
      )}
      {amountInRecursion < code.length && (
        <Character code={code} amountInRecursion={amountInRecursion + 1} />
      )}
    </React.Fragment>
  );
};

ReplayCard.displayName = "ReplayCard";
export default ReplayCard;
