"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import type { Snippet } from "@prisma/client";
import {
  acquitSnippetAction,
  deleteSnippetAction,
} from "@/app/_actions/snippet";
import { Logger } from "@/lib/logger";

export function ReviewButtons({ snippetId }: { snippetId: Snippet["id"] }) {
  const [isAcquitting, setIsAcquitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  return (
    <div className="flex justify-between">
      <Button
        disabled={isAcquitting || isDeleting}
        onClick={async () => {
          setIsAcquitting(true);
          try {
            await acquitSnippetAction({ id: snippetId });
          } catch (err) {
            Logger.Error("ReviewButttonsAcquit", err);
          } finally {
            setIsAcquitting(false);
          }
        }}
      >
        Acquit
      </Button>
      <Button
        disabled={isAcquitting || isDeleting}
        variant={"destructive"}
        onClick={async () => {
          setIsDeleting(true);
          try {
            await deleteSnippetAction({ id: snippetId, path: "/review" });
          } catch (err) {
            Logger.Error("ReviewButttonsDelete", err);
          } finally {
            setIsDeleting(false);
          }
        }}
      >
        Delete
      </Button>
    </div>
  );
}

export default ReviewButtons;
