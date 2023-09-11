"use client";

import type { Language } from "@/config/languages";
import type { CustomSnippet } from "@code-racer/wss/src/store/types";

import React from "react";

import { Button } from "@/components/ui/button";
import { getRandomSnippet } from "../../(play)/loaders";
import { toast } from "@/components/ui/use-toast";
import { downVoteSnippetAction } from "@/app/result/actions";

type Props = {
  snippetID: string;
  userID: string | null | undefined;
  language: Language;
  handleChangeSnippet: (_snippet: CustomSnippet) => void;
  disableTextArea: () => void;
};

const RacePracticeCardHeader: React.FC<Props> = React.memo(
  ({ snippetID, userID, language, handleChangeSnippet, disableTextArea }) => {
    const [transition, startTransition] = React.useTransition();
    const [whichButtonWasClicked, setWhichButtonWasClicked] = React.useState<
      "report" | "change" | undefined
    >();

    return (
      <div className="mb-8 flex justify-end gap-2 items-center">
        <Button
          onClick={() => {
            if (!transition) {
              setWhichButtonWasClicked("change");
              startTransition(() => {
                disableTextArea();
                getRandomSnippet({ language })
                  .then((snippet) => {
                    handleChangeSnippet({
                      id: snippet.id,
                      code: snippet.code,
                      name: snippet.name,
                      language: snippet.language as Language,
                    });
                  })
                  .catch((error) => {
                    console.error(error);
                    toast({
                      title: "Error!",
                      description:
                        "Something went wrong with getting a new snippet. Please try refreshing the page.",
                      variant: "destructive",
                    });
                  })
                  .finally(() => {
                    disableTextArea();
                    setWhichButtonWasClicked(undefined);
                  });
              });
            }
          }}
          disabled={transition}
          size="sm"
          variant="secondary"
        >
          {transition && whichButtonWasClicked === "change"
            ? "Gathering snippets..."
            : "Get Another Snippet"}
        </Button>
        {userID && process.env.NODE_ENV === "development" && (
          <Button
            onClick={() => {
              if (!transition) {
                disableTextArea();
                setWhichButtonWasClicked("report");
                startTransition(() => {
                  downVoteSnippetAction({ snippetId: snippetID })
                    .then(() => {
                      toast({
                        title: "Snippet reported",
                        description:
                          "Thank you for reporting this snippet.  We will review it soon.",
                        variant: "default",
                      });

                      getRandomSnippet({
                        language,
                        reportedSnippets: [snippetID],
                      })
                        .then((snippet) => {
                          if (snippet) {
                            handleChangeSnippet({
                              id: snippet.id,
                              name: snippet.name,
                              language: snippet.language as Language,
                              code: snippet.code,
                            });
                          } else {
                            toast({
                              title:
                                "Oops, this is the only unreported snippet left",
                              description:
                                "Please create a new snippet or choose a different language.",
                              variant: "destructive",
                            });
                          }
                        })
                        .catch(() => {
                          toast({
                            title: "Something went wrong",
                            description:
                              "Sorry, there was a problem getting a new snippet. Please create a new snippet or choose a different language.",
                            variant: "destructive",
                          });
                        })
                        .finally(() => {
                          disableTextArea();
                          setWhichButtonWasClicked(undefined);
                        });
                    })
                    .catch(() => {
                      toast({
                        title: "Something Went Wrong",
                        description:
                          "Sorry, but there was a problem reporting this snippet.",
                        variant: "destructive",
                      });
                      disableTextArea();
                      setWhichButtonWasClicked(undefined);
                    });
                });
              }
            }}
            variant="destructive"
            size="sm"
            disabled={transition}
          >
            {transition && whichButtonWasClicked === "report"
              ? "Reporting Snippet..."
              : "Report Snippet"}
          </Button>
        )}
      </div>
    );
  }
);

RacePracticeCardHeader.displayName = "RacePracticeCardHeader";
export default RacePracticeCardHeader;
