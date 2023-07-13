import { getCurrentUser } from "@/lib/session";

import TypingCode from "./typingCode";
import { prisma } from "@/lib/prisma";

import NoSnippet from "./noSnippet";

async function getRandomSnippet() {
  const itemCount = await prisma.snippet.count();
  const skip = Math.max(0, Math.floor(Math.random() * itemCount));

  return prisma.snippet
    .findMany({
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

export default async function Race({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  const user = await getCurrentUser();
  const snippet =
    (await getSearchParamSnippet(searchParams.snippetId)) ??
    (await getRandomSnippet());

  console.log(snippet);

  return (
    <main className="flex md:min-h-[calc(100vh-11rem)] flex-col items-center justify-between lg:p-24 p-10">
      {snippet && <TypingCode snippet={snippet} user={user} />}
      {!snippet && (
        <NoSnippet
          message={"Uh Oh, You currently do not have any snippet. Create one?"}
        />
      )}
    </main>
  );
}
