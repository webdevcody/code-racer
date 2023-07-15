import { getCurrentUser } from "@/lib/session";

import TypingCode from "../typing-code";
import { prisma } from "@/lib/prisma";

import NoSnippet from "../no-snippet";

interface RacePageSearchParams {
  snippetId: string;
  lang: string;
}

async function getRandomSnippet(lang: string) {
  const itemCount = await prisma.snippet.count();
  const skip = Math.max(0, Math.floor(Math.random() * itemCount));
  return prisma.snippet
    .findMany({
      where: {
        onReview: false,
        language: lang,
      },
      take: 1,
      skip: skip,
    })
    .then((results) => (results.length > 0 ? results[0] : undefined));
}

async function getSearchParamSnippet(snippetId: string | string[]) {
  if (typeof snippetId === "string") {
    return await prisma.snippet.findFirst({
      where: {
        id: snippetId,
      },
    });
  }
  return null;
}

export default async function PracticeRacePage({
  searchParams,
}: {
  searchParams: RacePageSearchParams;
}) {
  const user = await getCurrentUser();
  const snippet =
    (await getSearchParamSnippet(searchParams.snippetId)) ??
    (await getRandomSnippet(searchParams.lang));
  const language = searchParams.lang;

  return (
    <main className="flex flex-col items-center justify-between py-10 lg:p-24">
      {snippet && <TypingCode snippet={snippet} user={user} />}
      {!snippet && (
        <NoSnippet
          message={"Look like there is no snippet available yet. Create one?"}
          language={language}
        />
      )}
    </main>
  );
}
