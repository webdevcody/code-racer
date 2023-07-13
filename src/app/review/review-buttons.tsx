"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import type { Snippet } from "@prisma/client";
import { acquitSnippetAction, deleteSnippetAction } from "./actions";

interface ReviewButtonsProps {
  snippetId: Snippet["id"];
}

export function ReviewButtons({ snippetId }: ReviewButtonsProps) {
  const [isAcquitting, setIsAcquitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  return (
    <div className="flex justify-between">
      <Button
        disabled={isAcquitting || isDeleting}
        onClick={async () => {
          setIsAcquitting(true);
          try {
            await acquitSnippetAction(snippetId);
          } catch (err) {
            console.log(err);
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
            await deleteSnippetAction(snippetId);
          } catch (err) {
            console.log(err);
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
