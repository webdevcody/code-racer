"use client";

import React from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = {
  handleInputChange: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDownEvent: (_e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  input: string;
  code: string;
  didUserMistype: boolean;
};

/** Requires a ref to focus on the TextArea element! A function handler for that is onDivClick.
 *  We can also have a disabler for when, for example, we report a snippet or get a new one.
 *  We don't want the user to continue typing when we are fetching a new snippet for them.
 */
const TypingCard = React.memo(
  React.forwardRef<HTMLTextAreaElement, Props>(
    (
      { handleInputChange, handleKeyDownEvent, input, code, didUserMistype },
      ref
    ) => {
      return (
        <React.Fragment>
          <pre
            className="p-1 break-words whitespace-pre-wrap overflow-auto select-none"
            data-cy="code-snippet-preformatted"
          >
            <Character
              input={input}
              char={code.charAt(0)}
              code={code}
              idx={0}
              didUserMistype={didUserMistype}
              maxLength={code.length}
            />
          </pre>
          <div className="rounded-sm p-2 inset-0 m-auto absolute w-full h-full">
            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDownEvent}
              className="w-full h-full resize-none opacity-0 disabled:opacity-0 disabled:pointer-events-none pointer-events-none"
              data-cy="race-practice-input"
              autoComplete="off"
              ref={ref}
            />
          </div>
        </React.Fragment>
      );
    }
  )
);

type CharacterProps = {
  char: string;
  idx: number;
  maxLength: number;
  didUserMistype: boolean;
  input: string;
  code: string;
};

const Character: React.FC<CharacterProps> = React.memo(
  ({ char, idx, maxLength, didUserMistype, input, code }) => {
    const ERROR_CHARACTER = idx === input.length - 1 && didUserMistype;

    return (
      <React.Fragment>
        <span
          key={char + idx}
          className={cn("outline-border dark:opacity-70", {
            "outline-2 outline": char === " ",
            "outline-0": char === input.charAt(idx) && char === " ",
            "opacity-100 dark:opacity-100": char === input.charAt(idx),
            "animate-blink bg-yellow-400 dark:bg-yellow-300 opacity-90 dark:opacity-80 text-black":
              input.length === idx,
            "bg-red-800 dark:bg-red-500 underline-offset-2 opacity-100":
              ERROR_CHARACTER,
            underline: ERROR_CHARACTER && char !== " ",
          })}
        >
          {char === "\n" ? "⏎\n" : char}
        </span>
        {idx < maxLength && (
          <Character
            idx={idx + 1}
            maxLength={maxLength}
            input={input}
            char={code.charAt(idx + 1)}
            didUserMistype={didUserMistype}
            code={code}
          />
        )}
      </React.Fragment>
    );
  }
);

Character.displayName = "Character";
TypingCard.displayName = "TypingCard";

export default TypingCard;
