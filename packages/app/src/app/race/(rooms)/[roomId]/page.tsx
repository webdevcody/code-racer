import * as React from "react";

import { Room } from "./room";
import { getCurrentUser } from "@/lib/session";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const user = await getCurrentUser();

  return (
    <main className="flex flex-col items-center justify-between py-10 lg:p-24">
      <Room user={user} roomId={params.roomId} />
    </main>
  );
}
