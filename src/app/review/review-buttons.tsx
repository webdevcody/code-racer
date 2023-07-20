"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import type { Snippet } from "@prisma/client";
import { acquitSnippetAction, deleteSnippetAction } from "./actions";
import { catchError } from "@/lib/utils";

export function ReviewButtons({ snippetId }: { snippetId: Snippet["id"] }) {
  const [isAcquitting, setIsAcquitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  return (
    <div className="flex justify-between">
      <Button
        disabled={isAcquitting || isDeleting}
        variant={"success"}
        onClick={async () => {
          setIsAcquitting(true);
          try {
            await acquitSnippetAction({ id: snippetId });
          } catch (err) {
            catchError(err);
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
            catchError(err);
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
