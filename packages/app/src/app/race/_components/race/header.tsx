import { Heading } from "@/components/ui/heading";
import { ReportButton } from "./buttons/report-button";
import { Snippet } from ".prisma/client";
import type { User } from "next-auth";
import { Language } from "@/config/languages";

type Props = {
  user: User | undefined;
  snippet: Snippet;
  handleRestart: () => void;
};

export default function Header({ user, snippet, handleRestart }: Props) {
  return (
    <div className="mb-2 md:mb-4 flex justify-between">
      <Heading
        title="Type this code"
        description="Start typing to get racing"
      />
      {user && (
        <ReportButton
          snippetId={snippet.id}
          // userId={user.id}
          language={snippet.language as Language}
          handleRestart={handleRestart}
        />
      )}
    </div>
  );
}
