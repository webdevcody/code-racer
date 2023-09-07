import type { NextPage } from "next";

import { getCurrentUser } from "@/lib/session";
import { Renderer } from "./renderer";

const RaceRoomPage: NextPage = async () => {
  const userSession = await getCurrentUser();

  const session = {
    id: userSession?.id,
    name: userSession?.name,
    image: userSession?.image
  };

  return (
    <main className="flex flex-col gap-8 py-8">
      <Renderer session={session} />
    </main>
  );
};

export default RaceRoomPage;