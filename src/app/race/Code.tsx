import { cn } from "@/lib/utils";
interface CodeProps {
  code: string;
  userInput: string;
  errors: number[];
}
export default function Code({ code, errors, userInput }: CodeProps) {
  return (
    <pre className="text-primary mb-4 overflow-auto">
      {code.split("").map((char, index) => (
        <span
          key={index}
          className={cn({
            "text-red-500 opacity-100": errors.includes(index),
            "bg-yellow-200 opacity-80 text-black": userInput.length === index,
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
