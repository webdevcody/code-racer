"use client";

import type { Snippet, SnippetVote } from "@prisma/client";

import React from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

import { catchError, cn } from "@/lib/utils";

import {
  deleteVoteAction,
  downVoteSnippetAction,
  upvoteSnippetAction,
} from "../actions";

type Props = {
  snippetId: Snippet["id"];
  usersVote?: SnippetVote;
};

const LikeDislikeSnippet: React.FC<Props> = React.memo(
  ({ snippetId, usersVote }) => {
    // To prevent blocking UI
    const [isPending, startTransition] = React.useTransition();

    return (
      <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
        <span>Did you like this snippet?</span>
        <div className="flex items-center gap-2">
          <Button
            size={"icon"}
            variant={"outline"}
            className="p-1"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                try {
                  if (usersVote?.type === "UP") {
                    return void (await deleteVoteAction({ snippetId }));
                  }
                  await upvoteSnippetAction({ snippetId });
                } catch (err) {
                  catchError(err);
                }
              });
            }}
          >
            <Icons.thumbsUp
              className={cn("w-4 h-4", {
                "text-success-foreground": usersVote?.type === "UP",
              })}
            />
          </Button>
          <Button
            size={"icon"}
            variant={"outline"}
            className="p-1"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                try {
                  if (usersVote?.type === "DOWN") {
                    return void (await deleteVoteAction({
                      snippetId,
                    }));
                  }

                  await downVoteSnippetAction({
                    snippetId,
                  });
                } catch (err) {
                  catchError(err);
                }
              });
            }}
          >
            <Icons.thumbsDown
              className={cn("w-4 h-4", {
                "text-destructive": usersVote?.type === "DOWN",
              })}
            />
          </Button>
          {isPending && <Icons.spinner className="w-4 h-4 animate-spin" />}
        </div>
      </div>
    );
  }
);

LikeDislikeSnippet.displayName = "LikeDislikeSnippet";
export default LikeDislikeSnippet;
