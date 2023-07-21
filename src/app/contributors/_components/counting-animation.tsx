"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface CountingAnimationProps {
  targetNumber: number;
  startingNumber?: number;
  duration?: number; // miliseconds
  className?: string;
}

const UPDATE_INTERVAL = 100; // time delay between update cycle, in miliseconds

export default function CountingAnimation({
  targetNumber,
  startingNumber = 0,
  duration = 3000,
  className,
}: CountingAnimationProps) {
  const [currentNumber, setCurrentNumber] = useState<number>(startingNumber);
  const intervalID = useRef<any>(null);

  // Amount to increment in every update cycle
  const incrementValue = Math.ceil(
    (targetNumber - startingNumber) / (duration / UPDATE_INTERVAL),
  );

  function update() {
    // console.log("update invoked");
    setCurrentNumber((val) => {
      if (val >= targetNumber) {
        clearInterval(intervalID.current);
        return targetNumber;
      } else {
        return val + incrementValue;
      }
    });
  }

  useEffect(() => {
    // console.log("incrementValue", incrementValue);
    const ID = setInterval(update, UPDATE_INTERVAL);
    intervalID.current = ID;
    return () => {
      clearInterval(ID);
    };
  }, []);

  return <p className={cn("", className)}>{currentNumber}</p>;
}
