"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface CountingAnimationProps {
  targetNumber: number;
  startingNumber?: number;
  animationDuration?: number; // miliseconds
  className?: string;
}

export default function CountingAnimation({
  targetNumber,
  startingNumber = 0,
  animationDuration = 3000,
  className,
}: CountingAnimationProps) {
  const [currentNumber, setCurrentNumber] = useState<number>(startingNumber);
  const intervalID = useRef<any>(null);
  const incrementDuration = Math.abs(
    animationDuration / (targetNumber - startingNumber),
  );

  function update() {
    console.log("update invoked");
    setCurrentNumber((val) => {
      if (val >= targetNumber) {
        clearInterval(intervalID.current);
        return val;
      } else {
        return val + 1;
      }
    });
  }

  useEffect(() => {
    const ID = setInterval(update, incrementDuration);
    intervalID.current = ID;
    return () => {
      clearInterval(ID);
    };
  }, []);

  return <p className={cn("", className)}>{currentNumber}</p>;
}
