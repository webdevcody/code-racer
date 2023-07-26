import { getCurrentUser } from "@/lib/session";
import { getRandomSnippet } from "../loaders";
import NoSnippet from "../../_components/no-snippet";
import RacePractice from "../../_components/race/race-practice";
import { getSnippetById } from "../loaders";
import { CacheBuster } from "@/components/cache-buster";
import { Language, isValidLanguage } from "@/config/languages";
import { redirect } from "next/navigation";

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
  const language = searchParams.lang as Language;
  const isValidLang = isValidLanguage(language);
  if (!isValidLang) {
    redirect("/race");
  }

  const snippet =
    (await getSearchParamSnippet(searchParams.snippetId)) ??
    (await getRandomSnippet({ language: language }));

  return (
    <main>
      <CacheBuster />
      {snippet && (
        <div className="pt-8">
          <RacePractice snippet={snippet} user={user} />
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
