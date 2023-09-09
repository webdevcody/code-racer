"use client";

import type { Language } from "@/config/languages";
import type { CustomSnippet } from "@code-racer/wss/src/new-game";

import React from "react";

import { Button } from "@/components/ui/button";
import { getRandomSnippet } from "../../(play)/loaders";
import { toast } from "@/components/ui/use-toast";

type Props = {
  userID: string | null | undefined;
  language: Language;
  handleChangeSnippet: (_snippet: CustomSnippet) => void;
  handleReportSnippet: () => void;
  disableTextArea: () => void;
}

const RacePracticeCardHeader: React.FC<Props> = React.memo(({
  userID,
  language,
  handleChangeSnippet,
  handleReportSnippet,
  disableTextArea
}) => {
  const [transition, startTransition] = React.useTransition();

  return (
    <div className="mb-8 flex justify-end gap-2 items-center">
      <Button
        onClick={() => {
          if (!transition) {
            startTransition(() => {
              disableTextArea();
              getRandomSnippet({ language })
                .then((snippet) => {
                  handleChangeSnippet({
                    id: snippet.id,
                    code: snippet.code,
                    name: snippet.name,
                    language: snippet.language as Language
                  });
                })
                .catch((error) => {
                  console.error(error);
                  toast({
                    title: "Error!",
                    description: "Something went wrong with getting a new snippet. Please try refreshing the page.",
                    variant: "destructive"
                  });
                })
                .finally(disableTextArea);
            });
          }
        }}
        disabled={transition}
        size="sm"
        variant="secondary"
      >
        {transition ? "Gathering snippets..." : "Get Another Snippet"}
      </Button>
      {userID && process.env.NODE_ENV === "development" && (
        <Button
          onClick={handleReportSnippet}
          variant="destructive"
          size="sm"
          disabled={transition}
        >
          Report Snippet
        </Button>
      )}
    </div>
  );
});

RacePracticeCardHeader.displayName = "RacePracticeCardHeader";
export default RacePracticeCardHeader;