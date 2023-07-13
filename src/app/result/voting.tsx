"use client";

import * as React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { Snippet, SnippetVote } from "@prisma/client";
import { User } from "next-auth";
import { downvoteSnippetAction, upvoteSnippetAction } from "./actions";
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
    <div className="container flex items-center gap-2 max-w-xl">
      <span>How do you feel about the last snippet?</span>
      <div className="flex items-center gap-2">
        <Button
          size={"icon"}
          variant={"outline"}
          disabled={isPending}
          onClick={() => {
            if (usersVote?.type === "UP") return;
            startTransition(async () => {
              try {
                await upvoteSnippetAction({ userId, snippetId });
                toast({
                  title: "Success.",
                  description: "Thanks for your feedback! We will consider it.",
                  variant: "default",
                });
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
            if (usersVote?.type === "DOWN") return;
            startTransition(async () => {
              try {
                await downvoteSnippetAction({ userId, snippetId });
                toast({
                  title: "Success.",
                  description: "Thanks for your feedback! We will consider it.",
                  variant: "default",
                });
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
