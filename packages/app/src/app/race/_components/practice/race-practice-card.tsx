"use client";
import type { RoomProps } from "../../rooms/page";
import type { Snippet } from "@prisma/client";

import React from "react";
import dynamic from "next/dynamic";

import { useHandleRaceEvents } from "../../utils/useHandleRaceEvents";

import { languageTypes } from "@/lib/validations/room";
import { FALLBACK_IMG, RANDOM_USERNAME } from "@/config/consts";

import TypingCard from "../common/typing-card";

/** Dynamic imports are used so that these won't load until
 *  our TypingCard component fully loads.
 *  
 *  @see https://nextjs.org/learn/seo/improve/dynamic-import-components
 */
const ProgressTracker = dynamic(() => import("../common/progress-tracker"), {
  ssr: false
});
const RowLineTracker = dynamic(() => import("../common/row-line-tracker"), {
  ssr: false
});
const RacePracticeCardFooter = dynamic(() => import("./race-practice-card-footer"), {
  ssr: false
});
const RacePracticeCardHeader = dynamic(() => import("./race-practice-card-header"), {
  ssr: false
});

type Props = RoomProps & { snippet: Snippet };

export const RacePracticeCard: React.FC<Props> = React.memo(({ session, snippet }) => {
  const {
    handleChangeSnippet,
    handleReportSnippet,
    handleInputChange,
    handleKeyDownEvent,
    handleReset,
    state,
    amountOfLineBreaks,
    currentLineNumber,
    typingProgress,
    isUserFinished
  } = useHandleRaceEvents();

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

  const onDivClick = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      node.addEventListener("click", () => {
        if (!textAreaRef.current) {
          return;
        }

        textAreaRef.current.focus();
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
    <React.Fragment>
      <div
        className="focus-within:outline cursor-text focus-within:outline-4 focus-within:outline-border focus-within:outline-offset-4 focus-within:outline-offset-background dark:text-white text-black bg-slate-200/60 dark:bg-black/60 rounded-lg mx-auto dark:border-2 shadow-md shadow-black/20 px-4 py-8"
        ref={onDivClick}
      >
        {!isUserFinished && (
          <RacePracticeCardHeader
            handleReportSnippet={handleReportSnippet}
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
      </div>
    </React.Fragment>
  );
});

RacePracticeCard.displayName = "RacePracticeCard";
