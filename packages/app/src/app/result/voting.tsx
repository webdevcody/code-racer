"use client";

import * as React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { Snippet, SnippetVote } from "@prisma/client";
import { User } from "next-auth";
import {
  deleteVoteAction,
  downVoteSnippetAction,
  upvoteSnippetAction,
} from "./actions";
import { toast } from "@/components/ui/use-toast";
import { catchError, cn } from "@/lib/utils";

export function Voting({
  userId,
  snippetId,
  usersVote,
}: {
  userId?: User["id"];
  snippetId: Snippet["id"];
  usersVote?: SnippetVote;
}) {
  // To prevent blocking UI
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
      <span>How do you feel about the last snippet?</span>
      <div className="flex items-center gap-2">
        <Button
          size={"icon"}
          variant={"outline"}
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              try {
                if (usersVote?.type === "UP")
                  return void (await deleteVoteAction({ snippetId }));

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
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              try {
                if (usersVote?.type === "DOWN")
                  return void (await deleteVoteAction({
                    snippetId,
                  }));
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
