"use client";
import type { RoomProps } from "../../rooms/page";
import type { Snippet } from "@prisma/client";

import React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

import { useHandleRaceEvents } from "../../_utils/useHandleRaceEvents";

import { languageTypes } from "@/lib/validations/room";
import { FALLBACK_IMG, RANDOM_USERNAME } from "@/config/consts";

import TypingCard from "../common/typing-card";
import { saveUserResultAction } from "../../actions";
import { calculateAccuracy, calculateCPM } from "../../_utils/race-utils";
import { catchError } from "@/lib/utils";

/** Dynamic imports are used so that these won't load until
 *  our TypingCard component fully loads.
 *
 *  @see https://nextjs.org/learn/seo/improve/dynamic-import-components
 */
const ProgressTracker = dynamic(() => import("../common/progress-tracker"), {
  ssr: false,
});
const RowLineTracker = dynamic(() => import("../common/row-line-tracker"), {
  ssr: false,
});
const RacePracticeCardFooter = dynamic(
  () => import("./race-practice-card-footer"),
  {
    ssr: false,
  }
);
const RacePracticeCardHeader = dynamic(
  () => import("./race-practice-card-header"),
  {
    ssr: false,
  }
);

export const SESSION_STORAGE_KEY_TIMESTAMP = "codeRacerPracticeTimeStamp";

type Props = RoomProps & { snippet: Snippet };

const RacePracticeCard: React.FC<Props> = React.memo(({ session, snippet }) => {
  const {
    handleChangeSnippet,
    handleInputChange,
    handleKeyDownEvent,
    handleReset,
    state,
    amountOfLineBreaks,
    currentLineNumber,
    typingProgress,
    isUserFinished,
    code,
  } = useHandleRaceEvents();

  const [transition, startTransition] = React.useTransition();

  const router = useRouter();

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (snippet) {
      handleChangeSnippet({
        id: snippet.id,
        code: snippet.code,
        language: languageTypes.parse(snippet.language),
        name: snippet.name,
      });
    }
  }, [handleChangeSnippet, snippet]);

  React.useEffect(() => {
    if (isUserFinished && code) {
      if (!transition) {
        startTransition(() => {
          /** Since replayTimeStamp has some of the keys of
           *  charTimestamp, we just merge them into one.
           */
          sessionStorage.setItem(
            SESSION_STORAGE_KEY_TIMESTAMP,
            JSON.stringify({
              snippetID: state.snippet.id,
              chart: state.timeStamp,
            })
          );

          if (session?.id) {
            saveUserResultAction({
              timeTaken: state.totalTime,
              errors: state.totalErrors,
              cpm: +calculateCPM(code.length - 1, state.totalErrors).toFixed(2),
              accuracy: +calculateAccuracy(
                code.length - 1,
                state.totalErrors
              ).toFixed(2),
              snippetId: state.snippet.id,
            })
              .then(() => {
                router.replace("/result");
              })
              .catch(catchError);
          } else {
            router.replace("/result");
          }
        });
      }
    }
  }, [
    isUserFinished,
    state.timeStamp,
    state.snippet.id,
    state.totalErrors,
    state.totalTime,
    code,
    router,
    session?.id,
    transition,
  ]);

  const onDivClick = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      node.addEventListener("click", () => {
        if (!textAreaRef.current) {
          return;
        }

        if (!textAreaRef.current.disabled) {
          textAreaRef.current.focus();
        }
      });
    }
  }, []);

  const disableTextArea = React.useCallback(() => {
    if (!textAreaRef.current) {
      return;
    }
    if (textAreaRef.current.disabled) {
      textAreaRef.current.disabled = false;
    } else {
      textAreaRef.current.disabled = true;
    }
  }, []);

  return (
    <div
      className="relative focus-within:outline cursor-text focus-within:outline-4 focus-within:outline-border focus-within:outline-offset-4 focus-within:outline-offset-background dark:text-white text-black bg-slate-200/60 dark:bg-black/60 rounded-lg mx-auto dark:border-2 shadow-md shadow-black/20 px-4 py-8"
      ref={onDivClick}
    >
      {!isUserFinished && (
        <RacePracticeCardHeader
          snippetID={snippet.id}
          handleChangeSnippet={handleChangeSnippet}
          language={state.snippet.language}
          userID={session?.id}
          disableTextArea={disableTextArea}
        />
      )}
      <div className="pb-4">
        <ProgressTracker
          name={session?.name ?? RANDOM_USERNAME}
          image={session?.image ?? FALLBACK_IMG}
          progress={typingProgress}
        />
      </div>
      <div className="flex gap-2 relative rounded-lg my-1">
        <div className="grid border-r-2 border-yellow-600 m-1">
          <RowLineTracker
            currentLineNumber={currentLineNumber}
            amountOfRows={amountOfLineBreaks}
          />
        </div>
        <TypingCard
          isUserFinished={isUserFinished}
          handleInputChange={handleInputChange}
          handleKeyDownEvent={handleKeyDownEvent}
          input={state.input}
          code={state.snippet.code}
          didUserMistype={state.displayedErrorMessage ? true : false}
          ref={textAreaRef}
        />
      </div>
      {state.displayedErrorMessage && (
        <p className="px-4 text-sm mt-4 text-destructive">
          {state.displayedErrorMessage}
        </p>
      )}
      <RacePracticeCardFooter
        startTime={state.startTime}
        totalTime={state.totalTime}
        handleReset={handleReset}
      />

      {isUserFinished && transition && (
        <div className="inset-0 m-auto grid place-items-center absolute z-20 w-full h-full rounded-lg bg-background/80 backdrop-blur-lg">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader className="animate-spin w-8 h-8" />
            <p className="text-sm lg:text-base">
              Good job! Your result is being saved...
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

RacePracticeCard.displayName = "RacePracticeCard";
export default RacePracticeCard;
