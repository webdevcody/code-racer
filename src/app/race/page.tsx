import { getCurrentUser } from "@/lib/session";

import TypingCode from "./typingCode";

export default async function Race() {
  const user = await getCurrentUser();

  return (
    <>
      <main className="flex md:min-h-[calc(100vh-11rem)] flex-col items-center justify-between p-24">
        <TypingCode user={user} />
      </main>
    </>
  );
}
