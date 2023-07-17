import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { snippetLanguages } from "@/config/languages";
import Link from "next/link";

export default function NoSnippet({
  message,
  language,
}: {
  message: string;
  language: string;
}) {
  const formattedLanguage =
    snippetLanguages.find((snippet) => snippet.value === language)?.label ??
    language;
  return (
    <div className="flex flex-col gap-4 justify-start">
      <Heading
        title={`No ${formattedLanguage} snippet found`}
        description={message}
      />
      <Link
        href={`/add-snippet?lang=${
          language ? encodeURIComponent(language) : ""
        }`}
      >
        <Button>Create New Snippet</Button>
      </Link>
    </div>
  );
}
