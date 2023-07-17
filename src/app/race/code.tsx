import { cn } from "@/lib/utils";

export default function Code({
  code,
  errors,
  userInput,
  textIndicatorPosition,
}: {
  code: string;
  userInput: string;
  textIndicatorPosition: number | number[];
  errors: number[];
}) {
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

  function verifyErrors(errors: number[]) {
    if (errors.length > 0) {
      return (
        <span className="text-red-500">
          You must fix all errors before you can finish the race!
        </span>
      );
    }
  }

  return (
    <>
      <pre className="text-monochrome mb-4 overflow-auto font-medium">
        {code.split("").map((char, index) => (
          <span
            key={index}
            className={cn("border", {
              "text-red-500 opacity-100":
                code[index] !== " " && errors.includes(index),
              "border-red-500 opacity-100":
                code[index] === " " && errors.includes(index),
              "bg-yellow-200 opacity-80 text-black":
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
      {verifyErrors(errors)}
    </>
  );
}
