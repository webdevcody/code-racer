import { cn } from "@/lib/utils";

type CodeProps = {
  code: string;
  input: string;
  textIndicatorPosition: number;
};

export default function Code({
  code,
  input,
  textIndicatorPosition,
}: CodeProps) {
  const array: number[] = [];
  const currentCharacter = input.slice(-1);
  const expectedCharacter = code.charAt(textIndicatorPosition - 1);

  if (currentCharacter !== expectedCharacter) {
    array.push(textIndicatorPosition - 1);
  }

  return (
    <>
      <pre
        className="text-monochrome mb-4 overflow-auto font-medium px-2 w-full"
        data-cy="code-snippet-preformatted"
      >
        {code.split("").map((char, index) => (
          <span
            key={index}
            className={cn("border opacity-50", {
              "text-red-500 opacity-100":
                code[index] !== " " && array.includes(index),
              "border-red-500 opacity-100":
                code[index] === " " && array.includes(index),
              "bg-yellow-200 opacity-80 text-black":
                textIndicatorPosition === index,
              "opacity-100": input.length !== index && input[index] === char,
            })}
          >
            {char === "\n" ? "⏎\n" : char}
          </span>
        ))}
      </pre>
    </>
  );
}
