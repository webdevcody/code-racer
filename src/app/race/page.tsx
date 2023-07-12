import { getCurrentUser } from "@/lib/session";

import TypingCode from "./typingCode";
import { prisma } from "@/lib/prisma";

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

export default async function Race() {
  const user = await getCurrentUser();
  const snippet = await getRandomSnippet();

  return (
    <main className="flex md:min-h-[calc(100vh-11rem)] flex-col items-center justify-between p-24">
      {snippet && <TypingCode snippet={snippet} user={user} />}
    </main>
  );
}
