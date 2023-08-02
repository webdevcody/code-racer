"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import type { Snippet } from "@prisma/client";
import {
  acquitSnippetAction,
  deleteSnippetAction,
  updateSnippetCodeAction,
  deleteSnippetResultAction,
  notifyReportUser,
} from "../actions";
import { catchError } from "@/lib/utils";

export function ReviewButtons({
  snippetId,
  code,
  edited,
}: {
  snippetId: Snippet["id"];
  code: Snippet["code"];
  edited: boolean;
}) {
  const [isAcquitting, setIsAcquitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const isProcessing = isAcquitting || isDeleting || isUpdating;

  return (
    <div className="flex justify-between">
      {edited && (
        <Button
          variant={"success"}
          disabled={isProcessing}
          onClick={async () => {
            setIsUpdating(true);
            try {
              await updateSnippetCodeAction({
                id: snippetId,
                snippet: { code },
              });
              await deleteSnippetResultAction({
                snippetId: snippetId,
              });
              await notifyReportUser({
                snippetId: snippetId,
                notification: {
                  title: "Your Reported Snippet Has Been Updated",
                  description:
                    "The snippet you have reported has been updated, Click to check out",
                  ctaUrl: `/race/practice?${new URLSearchParams({
                    snippetId: snippetId,
                  }).toString()}`,
                },
              });
            } catch (err) {
              catchError(err);
            } finally {
              setIsUpdating(false);
            }
          }}
        >
          Update
        </Button>
      )}
      {!edited && (
        <Button
          disabled={isProcessing}
          variant={"success"}
          onClick={async () => {
            setIsAcquitting(true);
            try {
              await acquitSnippetAction({ id: snippetId });
              await notifyReportUser({
                snippetId: snippetId,
                notification: {
                  title: "Your Reported Snippet Has Been Acquitted ",
                  description:
                    "The snippet you have reported has been acquitted",
                },
              });
            } catch (err) {
              catchError(err);
            } finally {
              setIsAcquitting(false);
            }
          }}
        >
          Acquit
        </Button>
      )}
      <Button
        disabled={isProcessing}
        variant={"destructive"}
        onClick={async () => {
          setIsDeleting(true);
          try {
            await notifyReportUser({
              snippetId: snippetId,
              notification: {
                title: "Your Reported Snippet Has Been Deleted",
                description: "The snippet you have reported has been deleted",
              },
            });
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
