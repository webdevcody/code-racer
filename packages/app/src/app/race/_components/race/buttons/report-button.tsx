"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { Snippet } from "@prisma/client";
import { getRandomSnippet } from "../../../(play)/loaders";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { downVoteSnippetAction } from "@/app/result/actions";
import { Language } from "@/config/languages";

type ButtonProps = {
  snippetId: string;
  language: Language;
  handleRestart: () => void;
};

export function ReportButton({
  snippetId,
  language,
  handleRestart,
}: ButtonProps) {
  const [prevReportedSnippets, setPrevReportedSnippets] = React.useState<
    Snippet["id"][]
  >([]);
  const [isPending, startTransition] = React.useTransition();

  const router = useRouter();
  const pathname = usePathname();
  return (
    <Button
      disabled={isPending}
      // className="self-start"
      variant="destructive"
      onClick={() => {
        startTransition(async () => {
          try {
            await downVoteSnippetAction({ snippetId });
          } catch (err) {
            return void toast({
              title: "Something Went Wrong",
              description:
                "Sorry, but there was a problem reporting this snippet.",
              variant: "destructive",
            });
          }

          toast({
            title: "Snippet reported",
            description:
              "Thank you for reporting this snippet.  We will review it soon.",
            variant: "default",
          });

          const snippet = await getRandomSnippet({
            language: language,
            reportedSnippets: [...prevReportedSnippets, snippetId],
          });

          setPrevReportedSnippets((prev) => [snippetId, ...prev]);

          if (!snippet) {
            return void toast({
              title: "Oops, this is the only unreported snippet left",
              description:
                "Please create a new snippet or choose a different language.",
              variant: "destructive",
            });
          }

          router.push(
            `${pathname}?lang=${encodeURIComponent(
              language,
            )}&snippetId=${encodeURIComponent(snippet.id)}`,
          );
          router.refresh();
          handleRestart();
        });
      }}
    >
      {isPending && <Icons.spinner className="mr-2 animate-spin h-4 w-4" />}
      Report this snippet
    </Button>
  );
}
