import * as React from "react";

import { Room } from "./room";
import { getCurrentUser } from "@/lib/session";
import { env } from "@/env.mjs";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const user = await getCurrentUser();

  return (
    <main className="flex flex-col items-center justify-between py-10 lg:p-24">
      {env.NODE_ENV === "development" ? (
        <Room user={user} roomId={params.roomId} />
      ) : (
        <p>Page is under maintenance. Please come again at a later time.
          <br />
          We apologize for the inconvenience.
        </p>
      )}
    </main>
  );
}
