import { getCurrentUser } from "@/lib/session";

import TypingCode from "./typingCode";

export default async function Race() {
  const user = await getCurrentUser();

  console.log(user);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TypingCode user={user} />
      </main>
    </>
  );
}
