"use client";

import type { CustomSnippet } from "@code-racer/wss/src/store/types";

import React from "react";

import { RaceDispatch, RaceDispatchInitialState } from "./race-dispatch";
import { calculateAccuracy, calculateCPM, noopKeys } from "./race-utils";
import { searchForLineBreak } from "../../../lib/utils";

export const MAX_TRACKER_POSITION = 100;
export const TIMER_INTERVAL = 100;

/** This is to handle skipping over
 *  spaces on new lines.
 */
const handleEnter = (input: string, code: string): string => {
  let newInput = input;

  for (let idx = input.length; idx < code.length; ++idx) {
    if (code[idx] !== "\n" && code[idx] !== " ") {
      break;
    } else {
      newInput += code[idx];
    }
  }
  return newInput;
};

/** Responsible for all state handling for race.
 *  Take note that the logic for handling mistyped character errors
 *  will break if there are more than one mistyped character.
 *  Since the logic we currently have only checks if the latest
 *  character was mistyped (or, for Enter keydown event, the current text
 *  to be inserted is not === "\n").
 */
export const useHandleRaceEvents = () => {
  const [state, dispatch] = React.useReducer(
    RaceDispatch,
    RaceDispatchInitialState
  );

  const timerRef = React.useRef<NodeJS.Timer | null>(null);

  const code = React.useMemo(
    () => state.snippet?.code?.trimEnd(),
    [state.snippet?.code]
  );

  const typingProgress = React.useMemo(() => {
    if (!code) {
      return 0;
    }
    const position = Math.floor(
      (MAX_TRACKER_POSITION / code.length) * state.input.length
    );
    if (position >= MAX_TRACKER_POSITION) {
      return MAX_TRACKER_POSITION;
    } else {
      return position;
    }
  }, [code, state.input]);

  const isUserFinished = React.useMemo(() => {
    if (!code) {
      return false;
    } else {
      return state.input === code;
    }
  }, [state.input, code]);

  const amountOfLineBreaks = React.useMemo(
    () => searchForLineBreak(code ?? ""),
    [code]
  );

  const currentLineNumber = React.useMemo(
    () => searchForLineBreak(state.input),
    [state.input]
  );

  /** TIMER LOGIC */
  React.useEffect(() => {
    const updateElapsedTime = () => {
      dispatch({
        type: "add_total_time",
        payload: TIMER_INTERVAL / 1000,
      });
    };

    if (state.startTime && !timerRef.current) {
      timerRef.current = setInterval(() => {
        updateElapsedTime();
      }, TIMER_INTERVAL);
    }
  }, [state.startTime]);

  React.useEffect(() => {
    if (!timerRef.current) {
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, [isUserFinished]);
  /** TIMER LOGIC */

  const changeTimeStamps = React.useCallback(
    (value: string) => {
      if (state.startTime) {
        const currentTime = Date.now();
        const timeTaken = +(
          (currentTime - state.startTime.getTime()) /
          1000
        ).toFixed(2);

        dispatch({
          type: "change_timestamp",
          payload: [
            {
              word: value,
              accuracy: calculateAccuracy(value.length, timeTaken),
              cpm: calculateCPM(value.length, timeTaken),
              time: timeTaken,
              errors: state.totalErrors,
            },
          ],
        });
      }
    },
    [state.startTime, state.totalErrors]
  );

  /** We are using an onChange handler
   *  to simplify logic.
   *
   * A user will not be able to type anything if:
   *
   * 1. They entered a wrong character. They will be able to press backspace to fix their error.
   */
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const inputValue = e.target.value;

      if (state.displayedErrorMessage) {
        const USER_PRESSED_BACKSPACE_AND_ONLY_ONE_CHAR_WAS_MISTYPED =
          inputValue === code?.slice(0, inputValue.length);
        if (USER_PRESSED_BACKSPACE_AND_ONLY_ONE_CHAR_WAS_MISTYPED) {
          changeTimeStamps(inputValue);
          dispatch({
            type: "change_input",
            payload: inputValue,
          });
        }
      } else {
        changeTimeStamps(inputValue);
        dispatch({
          type: "change_input",
          payload: inputValue,
        });
      }

      const LAST_CHARACTER_OF_USER_INPUT_IS_NOT_EQUAL_TO_CODE_BASED_ON_INPUT_LENGTH =
        inputValue !== code?.slice(0, inputValue.length);

      if (
        LAST_CHARACTER_OF_USER_INPUT_IS_NOT_EQUAL_TO_CODE_BASED_ON_INPUT_LENGTH
      ) {
        dispatch({
          type: "add_errors",
          payload: 1,
        });
        dispatch({
          type: "display_error_message",
          payload:
            "Please follow the following code. You won't be able to insert a character that is not equal to the displayed code.",
        });
        return;
      }
    },
    [state.displayedErrorMessage, code, changeTimeStamps]
  );

  const startTimer = React.useCallback(() => {
    dispatch({ type: "set_start_time" });
  }, []);

  /** Responsible for:
   *  1. Escape key (Restart [In multiplayer race, this must be disabled to allow fairness.])
   *  2. Enter key
   *  3. Automatic appending of whitespace on Enter
   */
  const handleKeyDownEvent = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const USER_STARTED_TYPING = !state.input && !state.startTime;

      if (USER_STARTED_TYPING) {
        startTimer();
      }

      if (noopKeys.includes(e.key)) {
        e.preventDefault();
        return;
      }

      switch (e.key) {
        case "Escape":
          dispatch({ type: "reset" });
          break;
        case "Enter":
          e.preventDefault();
          if (code) {
            const LAST_CHARACTER_OF_USER_INPUT_IS_NOT_EQUAL_TO_CODE_BASED_ON_INPUT_LENGTH =
              state.input !== code?.slice(0, state.input.length);
            if (
              !LAST_CHARACTER_OF_USER_INPUT_IS_NOT_EQUAL_TO_CODE_BASED_ON_INPUT_LENGTH
            ) {
              const newValueAfterCalculatingWhitespaces = handleEnter(
                state.input,
                code
              );
              changeTimeStamps(newValueAfterCalculatingWhitespaces);
              dispatch({
                type: "change_input",
                payload: newValueAfterCalculatingWhitespaces,
              });
            }
          }
          break;
      }
    },
    [state.input, state.startTime, code, changeTimeStamps, startTimer]
  );

  const handleChangeSnippet = React.useCallback((snippet: CustomSnippet) => {
    dispatch({ type: "reset" });
    dispatch({
      type: "change_snippet",
      payload: {
        id: snippet.id,
        name: snippet.name,
        code: snippet.code,
        language: snippet.language,
      },
    });
  }, []);

  const handleReset = React.useCallback(() => {
    dispatch({ type: "reset" });
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    state,
    code,
    typingProgress,
    isUserFinished,
    currentLineNumber,
    amountOfLineBreaks,
    handleInputChange,
    handleKeyDownEvent,
    handleChangeSnippet,
    handleReset,
    startTimer,
  };
};
