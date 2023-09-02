"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { saveUserResultAction } from "../../actions";

// utils
import { calculateAccuracy, calculateCPM, noopKeys } from "./utils";

// Components
import Code from "./code";
import Footer from "./footer";
import Header from "./header";
import LineNumbers from "./line-numbers";
import RaceTracker from "./race-tracker";

// Types
import { useCheckForUserNavigator } from "@/lib/user-system";
import { catchError } from "@/lib/utils";
import type { Snippet } from "@prisma/client";
import type { User } from "next-auth";
import type { ChartTimeStamp, ReplayTimeStamp } from "./types";
import { useEffectOnce } from "react-use";

type RacePracticeProps = {
  user?: User;
  snippet: Snippet;
};

export default function RacePractice({ user, snippet }: RacePracticeProps) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalErrors, setTotalErrors] = useState(0);
  const [chartTimeStamp, setChartTimeStamp] = useState<ChartTimeStamp[]>([]);
  const [replayTimeStamp, setReplayTimeStamp] = useState<ReplayTimeStamp[]>([]);
  const [windowStart, setWindowStart] = useState<number>(0);
  const [windowEnd, setWindowEnd] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const inputElement = useRef<HTMLInputElement | null>(null);
  const code = snippet.code.trimEnd();
  const router = useRouter();
  const isRaceFinished = input === code;

  const isUserOnAndroid = useCheckForUserNavigator("android");
  //for auto scroll
  const preElement = useRef<HTMLPreElement | null>(null);
  const scrollUpperLimit = 7;
  const scrollLowerLimit = 7 - 1; //1 is deducted because when scrolling backwards, we count from the left side
  const spanElementWidth = 10.4; //the span element will always have this width
  useEffect(() => {
    localStorage.removeItem("chartTimeStamp");
    if (!inputElement.current) return;
    inputElement.current.focus();
  });

  useEffectOnce(() => {
    if (preElement.current) {
      setWindowEnd(
        Math.floor(
          preElement.current?.getBoundingClientRect().width / spanElementWidth
        )
      );
    }
  });
  useEffect(() => {
    preElement.current?.scrollTo(scrollPosition, 0);
  }, [scrollPosition]);

  useEffect(() => {
    if (isRaceFinished) {
      if (!startTime) return;
      const endTime = new Date();
      const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

      localStorage.setItem(
        "chartTimeStamp",
        JSON.stringify([
          ...chartTimeStamp,
          {
            char: input.slice(-1),
            accuracy: calculateAccuracy(input.length, totalErrors),
            cpm: calculateCPM(input.length, timeTaken),
            time: Date.now(),
          },
        ])
      );

      localStorage.setItem(
        "replayTimeStamp",
        JSON.stringify([
          ...replayTimeStamp,
          {
            char: input.slice(-1),
            textIndicatorPosition: input.length,
            time: Date.now(),
          },
        ])
      );

      if (user) {
        saveUserResultAction({
          timeTaken,
          errors: totalErrors,
          cpm: calculateCPM(code.length - 1, timeTaken),
          accuracy: calculateAccuracy(code.length - 1, totalErrors),
          snippetId: snippet.id,
        })
          .then((result) => {
            router.push(`/result?resultId=${result.id}`);
          })
          .catch((error) => catchError(error));
      } else {
        router.push(`/result?snippetId=${snippet.id}`);
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleInputEvent(e: any /** React.FormEvent<HTMLInputElement>*/) {
    if (!isUserOnAndroid) return;
    if (!startTime) {
      setStartTime(new Date());
    }
    const data = e.nativeEvent.data;

    if (
      input !== code.slice(0, input.length) &&
      e.nativeEvent.inputType !== "deleteContentBackward"
    ) {
      e.preventDefault();
      return;
    }

    if (e.nativeEvent.inputType === "insertText") {
      setInput((prevInput) => prevInput + data);
    } else if (e.nativeEvent.inputType === "deleteContentBackward") {
      Backspace();
    }
    changeTimeStamps(e);
  }

  function handleKeyboardDownEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    //scroll to the cursor position
    preElement.current?.scrollTo(scrollPosition, 0);
    // For ANDROID.
    // since the enter button on a mobile keyboard/keypad actually
    // returns a e.key of "Enter" onkeydown, we just set a condition for that.
    if (isUserOnAndroid) {
      switch (e.key) {
        case "Enter":
          if (!startTime) {
            setStartTime(new Date());
          }
          if (input !== code.slice(0, input.length)) return;
          Enter();
          break;
        // this is to delete the characters when "Enter" is pressed;
        case "Backspace":
          Backspace();
          break;
      }
      return;
    }

    // Restart
    if (e.key === "Escape") {
      handleRestart();
      return;
    }
    // Unfocus Shift + Tab
    if (e.shiftKey && e.key === "Tab") {
      e.currentTarget.blur();
      return;
    }
    // Reload Control + r
    if (e.ctrlKey && e.key === "r") {
      e.preventDefault();
      return;
    }
    // Catch Alt Gr - Please confirm I am unable to test this
    if (e.ctrlKey && e.altKey) {
      e.preventDefault();
    }

    if (noopKeys.includes(e.key)) {
      e.preventDefault();
    } else {
      switch (e.key) {
        case "Backspace":
          Backspace();
          break;
        case "Enter":
          if (input !== code.slice(0, input.length)) {
            return;
          }
          Enter();
          if (!startTime) {
            setStartTime(new Date());
          }
          break;
        default:
          if (input !== code.slice(0, input.length)) {
            return;
          }
          Key(e);
          if (!startTime) {
            setStartTime(new Date());
          }
          break;
      }
    }

    changeTimeStamps(e);
  }

  // since this logic of setting timestamps will be reused
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function changeTimeStamps(e: any) {
    let value: string;

    // if keyboardDown event is the one that calls this
    if (e.key) {
      value = e.key;
      // so, this is where we can access the value of the key pressed on mobile
    } else {
      const data = e.nativeEvent.data;

      if (e.nativeEvent.inputType === "deleteContentBackward") {
        // the 2nd to the last character
        const latestValue = input[input.length - 2];
        if (!latestValue) {
          value = "";
        } else {
          value = latestValue;
        }
      } else if (e.nativeEvent.inputType === "insertText") {
        value = data;
      } else {
        value = "Enter";
      }
    }

    if (value === code[input.length - 1] && value !== " ") {
      const currTime = Date.now();
      const timeTaken = startTime ? (currTime - startTime.getTime()) / 1000 : 0;
      setChartTimeStamp((prev) => [
        ...prev,
        {
          char: value,
          accuracy: calculateAccuracy(input.length, totalErrors),
          cpm: calculateCPM(input.length, timeTaken),
          time: currTime,
        },
      ]);
    }
    setReplayTimeStamp((prev) => [
      ...prev,
      {
        char: input.slice(-1),
        textIndicatorPosition: input.length,
        time: Date.now(),
      },
    ]);
  }

  function Backspace() {
    if (input.length === 0) {
      return;
    }
    const character = input.slice(-1);
    setInput((prevInput) => {
      const updatedInput = prevInput.slice(0, -1);

      if (character === "\n") {
        const lineNumber = updatedInput.split("\n").length;
        const totalCharactersInput = Number(
          updatedInput.split("\n")[lineNumber - 1]?.length
        );
        setScrollPosition(
          (totalCharactersInput -
            Math.floor(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (preElement.current?.getBoundingClientRect().width as any) /
                spanElementWidth
            ) +
            scrollUpperLimit +
            1) *
            spanElementWidth
          // spanElement?.current?.getBoundingClientRect().width
        );
        setWindowEnd(totalCharactersInput + scrollUpperLimit + 1);
        setWindowStart(totalCharactersInput + scrollUpperLimit + 1 - 67);
      } else {
        handleScrollNegative(updatedInput);
      }
      return updatedInput;
    });

    if (character !== " " && character !== "\n") {
      setChartTimeStamp((prevArray) => prevArray.slice(0, -1));
    }
  }

  function Enter() {
    if (code.charAt(input.length) !== "\n") {
      setInput((prevInput) => prevInput + "\n");
      return;
    }

    const lines = input.split("\n");
    const allLines = code.split("\n");
    const nextLine = allLines[lines.length];
    if (code.charAt(input.length) === "\n") {
      let indent = "";
      let i = 0;
      while (nextLine.charAt(i) === " ") {
        indent += " ";
        i++;
      }
      preElement.current?.scrollTo(0, 0);

      setWindowEnd(
        Math.floor(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (preElement?.current?.getBoundingClientRect().width as any) /
            spanElementWidth
        )
      );

      setWindowStart(0);
      setScrollPosition(0);
      setInput((prevInput) => prevInput + "\n" + indent);
    }
  }

  function Key(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== code.slice(input.length, input.length + 1)) {
      setTotalErrors((prevTotalErrors) => prevTotalErrors + 1);
    }
    setInput((prevInput) => {
      const updated = prevInput + e.key;

      handleScrollPositive(updated);
      return updated;
    });

    if (e.key !== " ") {
      const currTime = Date.now();
      const timeTaken = startTime ? (currTime - startTime.getTime()) / 1000 : 0;
      setChartTimeStamp((prevArray) => [
        ...prevArray,
        {
          char: e.key,
          accuracy: calculateAccuracy(input.length, totalErrors),
          cpm: calculateCPM(input.length, timeTaken),
          time: currTime,
        },
      ]);
    }
    setReplayTimeStamp((prev) => [
      ...prev,
      {
        char: input.slice(-1),
        textIndicatorPosition: input.length,
        time: Date.now(),
      },
    ]);
  }

  function handleRestart() {
    setStartTime(null);
    setInput("");
    setTotalErrors(0);
    setReplayTimeStamp([]);
    setChartTimeStamp([]);
    setWindowEnd(
      Math.floor(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (preElement.current?.getBoundingClientRect().width as any) /
          spanElementWidth
      )
    );
  }
  //function to handle scroll to the right
  function handleScrollPositive(updatedInput: string) {
    const lineNumber = input.split("\n").length;
    const totalCharactersInput = Number(
      updatedInput.split("\n")[lineNumber - 1]?.length
    );
    if (windowEnd - totalCharactersInput <= scrollUpperLimit) {
      setWindowEnd((previousValue) => previousValue + 1);
      setWindowStart((prev) => prev + 1);
      setScrollPosition((prev) => prev + spanElementWidth);
    }
  }
  //function to handle scroll to the left when backspaced
  function handleScrollNegative(updatedInput: string) {
    const lineNumber = input.split("\n").length;
    const totalCharactersInput = Number(
      updatedInput.split("\n")[lineNumber - 1]?.length
    );

    if (totalCharactersInput - windowStart <= scrollLowerLimit) {
      setWindowStart((previousValue) => previousValue - 1);
      setWindowEnd((previousValue) => previousValue - 1);
      setScrollPosition((prev) => prev - spanElementWidth);
    }
  }

  return (
    <div
      className="relative flex flex-col w-[clamp(10rem,95%,50rem)] gap-2 p-4 mx-auto rounded-md lg:p-8 bg-accent"
      onClick={() => {
        inputElement.current?.focus();
      }}
      role="none"
    >
      <RaceTracker
        user={user}
        position={input.length}
        codeLength={code.length}
      />
      <Header user={user} snippet={snippet} handleRestart={handleRestart} />
      <section className="flex">
        <LineNumbers code={code} currentLineNumber={input.split("\n").length} />
        <Code code={code} input={input} preRef={preElement} />
        <input
          type="text"
          ref={inputElement}
          onKeyDown={handleKeyboardDownEvent}
          onInput={handleInputEvent}
          disabled={input === code}
          className="absolute inset-y-0 left-0 w-full h-full p-8 rounded-md -z-40 focus:outline outline-blue-500 cursor-none"
          onPaste={(e) => e.preventDefault()}
          data-cy="race-practice-input"
          autoComplete="off"
        />
      </section>
      <Footer
        code={code}
        input={input}
        startTime={startTime}
        handleRestart={handleRestart}
      />
    </div>
  );
}
