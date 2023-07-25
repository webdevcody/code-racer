"use client";
import { cn } from "@/lib/utils";

export default function Code({
  code,
  userInput,
  textIndicatorPosition,
  errors,
}: {
  code: string;
  userInput: string;
  textIndicatorPosition: number;
  errors: number[];
}) {
  return (
    <>
      <pre className="text-monochrome mb-4 overflow-auto font-medium px-2 w-full">
        {code.split("").map((char, index) => (
          <span
            key={index}
            className={cn("border", {
              "text-red-500 opacity-100":
                code[index] !== " " && errors.includes(index),
              "border-red-500 opacity-100":
                code[index] === " " && errors.includes(index),
              "bg-yellow-200 opacity-80 text-black":
                textIndicatorPosition === index,
              "opacity-100":
                userInput.length !== index && userInput[index] === char,
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
