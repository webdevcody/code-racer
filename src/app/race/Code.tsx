import { cn } from "@/lib/utils";
interface CodeProps {
  code: string;
  userInput: string;
  textPosition: number;
  errors: number[];
}
export default function Code({ code, errors, userInput, textPosition }: CodeProps) {
  return (
    <pre className="text-primary mb-4 overflow-auto">
      {code.split("").map((char, index) => (
        <span
          key={index}
          className={cn({
            "text-red-500 opacity-100": errors.includes(index),
            "bg-yellow-200 opacity-80 text-black": textPosition === index,
            "opacity-100":
              textPosition !== index && userInput[index] === char,
            "opacity-50":
              textPosition !== index && userInput[index] !== char,
          })}
        >
          {char}
        </span>
      ))}
    </pre>
  );
}
