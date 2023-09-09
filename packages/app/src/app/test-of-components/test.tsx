"use client";

import type { Snippet } from "@/lib/prisma";

import { useHandleRaceEvents } from "../race/utils/useHandleRaceEvents";
import React from "react";
import { Textarea } from "@/components/ui/textarea";

export const TestComponent: React.FC<{ snippet: Snippet }> = ({ snippet }) => {
  const { handleInputChange, handleChangeSnippet, state, code } =
    useHandleRaceEvents();

  React.useEffect(() => {
    handleChangeSnippet(snippet);
  }, [handleChangeSnippet, snippet]);

  console.log(state);
  return (
    <React.Fragment>
      <pre>{state.snippet?.code}</pre>
      <Textarea value={state.input} onChange={handleInputChange} />
      {state.displayedErrorMessage && (
        <p className="text-destructive">{state.displayedErrorMessage}</p>
      )}
    </React.Fragment>
  );
};
