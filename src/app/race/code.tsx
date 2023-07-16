import { useRef } from "react";
import { cn } from "@/lib/utils";
import Follower from "./follower";

interface CodeProps {
  code: string;
  userInput: string;
  errors: number[];
}
export default function Code({ code, errors, userInput }: CodeProps) {
  const codeContainerRef = useRef<HTMLPreElement>(null);

  return (
    <>
      <pre className="text-primary mb-4 overflow-auto">
        <Follower codeContainerRef={codeContainerRef} userInput={userInput} />
        {code.split("").map((char, index) => (
          <span
            key={index}
            className={cn("border", {
              "text-red-500 opacity-100":
                code[index] !== " " && errors.includes(index),
              "border-red-500 opacity-100":
                code[index] === " " && errors.includes(index),
              "opacity-70": userInput.length === index,
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
      {errors.length > 0 && (
        <span className="text-red-500">
          You must fix all errors before you can finish the race!
        </span>
      )}
    </>
  );
}
