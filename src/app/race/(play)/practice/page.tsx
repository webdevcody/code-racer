import { getCurrentUser } from "@/lib/session";

import { getRandomSnippet } from "../loaders";

import NoSnippet from "../../no-snippet";
import Race from "../../race";
import { getSnippetById } from "./loaders";

async function getSearchParamSnippet(snippetId: string | string[]) {
  if (typeof snippetId === "string") {
    return await getSnippetById(snippetId);
  }
  return null;
}

export default async function PracticeRacePage({
  searchParams,
}: {
  searchParams: {
    snippetId: string;
    lang: string;
  };
}) {
  const user = await getCurrentUser();
  const snippet =
    (await getSearchParamSnippet(searchParams.snippetId)) ??
    (await getRandomSnippet({ language: searchParams.lang }));
  const language = searchParams.lang;

  return (
    <main>
      {snippet && (
        <div className="pt-8">
          <Race snippet={snippet} user={user} />
        </div>
      )}
      {!snippet && (
        <NoSnippet
          message={"Looks like there is no snippet available yet. Create one?"}
          language={language}
        />
      )}
    </main>
  );
}
