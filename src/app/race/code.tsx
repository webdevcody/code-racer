"use client";

import { cn } from "@/lib/utils";
import { createRef, useEffect, useRef } from "react";

export default function Code({
  code,
  errors,
  userInput,
  textIndicatorPosition,
  currentLineNumber,
  currentCharPosition,
  totalErrors,
}: {
  code: string;
  userInput: string;
  textIndicatorPosition: number | number[];
  currentLineNumber: number;
  currentCharPosition: number;
  errors: number[];
  totalErrors: number;
}) {
  const spanRefs = useRef<(React.RefObject<HTMLSpanElement> | null)[]>([]);
  spanRefs.current = Array(code.length)
    .fill(" ")
    .map((_, i) => spanRefs.current[i] || createRef());

  useEffect(() => {
    const span = spanRefs.current[0]?.current;
    const charWidth = span?.offsetWidth;

    const currentLine = code.split("\n")[currentLineNumber - 1];
    const lineLength = currentLine?.length;
    const progress = currentCharPosition / lineLength - 0.33;
    // console.table({
    //   currentLineNumber,
    //   currentCharPosition,
    //   progress,
    //   lineLength,
    //   currentLine,
    //   totalErrors,
    // });

    const pre = span?.parentNode as HTMLElement;

    if (pre && charWidth) {
      const lineContentWidth = lineLength * charWidth;
      if (lineContentWidth > pre.clientWidth) {
        pre.scrollLeft = progress * lineContentWidth;
      } else {
        pre.scrollLeft = 0;
      }
    }
  }, [code, currentLineNumber, currentCharPosition]);

  function textIndicatorPositionDeterminer(charIndex: number) {
    if (!Array.isArray(textIndicatorPosition)) {
      return charIndex === textIndicatorPosition;
    } else {
      for (let i = 0; i < textIndicatorPosition.length; i++) {
        if (charIndex === textIndicatorPosition[i]) {
          return true;
        }
      }
    }
  }

  return (
    <>
      <pre className="text-monochrome mb-4 overflow-auto font-medium px-2 w-full">
        {code.split("").map((char, index) => (
          <span
            key={index}
            ref={spanRefs.current[index]}
            className={cn("border border-transparent", {
              "text-red-500 opacity-100":
                code[index] !== " " && errors.includes(index),
              "border-red-500 opacity-100":
                code[index] === " " && errors.includes(index),
              "dark:bg-yellow-200 bg-yellow-600 opacity-80 text-black":
                textIndicatorPositionDeterminer(index),
              "opacity-100":
                userInput.length !== index && userInput[index] === char,
              // The next character to be typed
              "opacity-[0.75]": userInput.length === index,
              "border-monochrome/50":
                code[index] === " " && userInput.length === index,
              "opacity-50":
                !errors.includes(index) &&
                userInput.length !== index &&
                userInput[index] !== char,
            })}
          >
            {char === "\n" ? "⏎\n" : char}
          </span>
        ))}
      </pre>
    </>
  );
}
