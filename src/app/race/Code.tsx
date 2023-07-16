import { useRef } from "react";
import { cn } from "@/lib/utils";
import Follower from "./Follower";

interface CodeProps {
  code: string;
  userInput: string;
  errors: number[];
}
export default function Code({ code, errors, userInput }: CodeProps) {
  const codeContainerRef = useRef<HTMLPreElement>(null);

  return (
    <pre ref={codeContainerRef} className="text-primary mb-4 overflow-auto">
      <Follower codeContainerRef={codeContainerRef} userInput={userInput} />
      {code.split("").map((char, index) => (
        <span
          key={index}
          className={cn({
            "text-red-500 opacity-100": errors.includes(index),
            "opacity-70 ": userInput.length === index,
            "opacity-100":
              userInput.length !== index && userInput[index] === char,
            "opacity-50":
              userInput.length !== index && userInput[index] !== char,
          })}
        >
          {char}
        </span>
      ))}
    </pre>
  );
}
