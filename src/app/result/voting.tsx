"use client";

import * as React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { Snippet, SnippetVote } from "@prisma/client";
import { User } from "next-auth";
import {
  deleteVoteAction,
  downvoteSnippetAction,
  upvoteSnippetAction,
} from "./actions";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";

interface VotingProps {
  userId: User["id"];
  snippetId: Snippet["id"];
  usersVote?: SnippetVote;
}

export function Voting({ userId, snippetId, usersVote }: VotingProps) {
  // To prevent blocking UI
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2">
      <span>How do you feel about the last snippet?</span>
      <div className="flex items-center gap-2">
        <Button
          size={"icon"}
          variant={"outline"}
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              try {
                if (usersVote?.type === "UP") {
                  await deleteVoteAction({ userId, snippetId });
                } else {
                  await upvoteSnippetAction({ userId, snippetId });
                  toast({
                    title: "Success.",
                    description:
                      "Thanks for your feedback! We will consider it.",
                    variant: "default",
                  });
                }
              } catch (err) {
                err instanceof Error
                  ? toast({
                      title: "Error",
                      description: err.message,
                      variant: "destructive",
                    })
                  : toast({
                      title: "Error",
                      description: "Something went wrong, please try again.",
                      variant: "destructive",
                    });
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
                if (usersVote?.type === "DOWN") {
                  await deleteVoteAction({ userId, snippetId });
                } else {
                  await downvoteSnippetAction({ userId, snippetId });
                  toast({
                    title: "Success.",
                    description:
                      "Thanks for your feedback! We will consider it.",
                    variant: "default",
                  });
                }
              } catch (err) {
                err instanceof Error
                  ? toast({
                      title: "Error",
                      description: err.message,
                      variant: "destructive",
                    })
                  : toast({
                      title: "Error",
                      description: "Something went wrong, please try again.",
                      variant: "destructive",
                    });
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
