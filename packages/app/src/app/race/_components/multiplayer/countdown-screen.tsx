"use client";

import React from "react";

import { RACE_STATUS } from "@code-racer/wss/src/consts";

import { siteConfig } from "@/config/site";
import { socket } from "@/lib/socket";

type Props = {
  roomID: string;
};

const SECOND = 1000;

const CountdownScreen: React.FC<Props> = React.memo(({ roomID }) => {
  const [count, setCount] = React.useState(
    siteConfig.multiplayer.startGameCountdown
  );

  React.useEffect(() => {
    /** USING TIMEOUT BECAUSE useRef timer does not work. */
    const timeout = setTimeout(() => {
      setCount((currentCount) => currentCount - 1);
    }, SECOND);
    return () => {
      clearTimeout(timeout);
    };
  }, [count]);

  React.useEffect(() => {
    if (count === 0) {
      socket.emit("ChangeGameStatusOfRoom", {
        roomID,
        raceStatus: RACE_STATUS.RUNNING,
      });
    }
  }, [count, roomID]);

  return (
    <div className="min-h-[10rem] font-bold text-2xl lg:text-4xl grid place-items-center">
      <span className="w-fit animate-counter">{count}</span>
    </div>
  );
});

CountdownScreen.displayName = "CountdownScreen";

export default CountdownScreen;
