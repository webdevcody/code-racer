import { cn } from "@/lib/utils";
import "./animation.css";

interface displayCodeProps {
  code: string;
  userInput: string;
  errors: number[];
}

export default function DisplayedCode({
  code,
  errors,
  userInput,
}: displayCodeProps) {
  return (
    <pre className="mb-4 text-primary">
      {code.split("").map((char, index) => (
        <span
          key={index}
          className={cn({
            "bg-red-500 opacity-100": errors.includes(index),
            "blink-animation": userInput.length === index,
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
