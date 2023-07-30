import * as React from "react";

import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { getSnippetById } from "../../(play)/loaders";
import { toast } from "@/components/ui/use-toast";
import { Snippet } from "@prisma/client";
import { Room } from "./room";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function RoomPage({params}: {params: {roomId: string}}) {
  const user = await getCurrentUser();

  if (!user) redirect("auth");

  return (
    <div>
      <Room user={user} roomId={params.roomId}/>
    </div>
  );
}
