import { ProgressBar, ProgressIndicator } from "@/components/ui/progress-bar";
import Image from "next/image";
import type { User } from "next-auth";
import React, { useState } from "react";
import { getParticipantUser } from "./actions";

export default function RaceTracker({
  user,
  position,
  participantId,
}: {
  position: number;
  user?: User;
  participantId?: string;
}) {
  const [participantUser, setParticipantUser] = React.useState<
    User | undefined
  >(undefined);

  async function fetchParticipantUser() {
    if (participantId) {
      const user = await getParticipantUser({ participantId });
      if (user) {
        setParticipantUser(user as User);
      }
    }
  }
  React.useEffect(() => void fetchParticipantUser(), [participantId]);

  return (
    <div className="relative mb-5 flex items-center">
      <ProgressBar>
        <ProgressIndicator progress={position}>
          <Image
            className="absolute left-0 top-[-50%] border-2 border-monochrome rounded-full transition-all duration-300 ease-in-out"
            src={
              participantUser?.image ?? user?.image ?? "/placeholder-image.jpg"
            }
            alt={
              `${participantUser?.name ?? user?.name} avatar` ?? "user avatar"
            }
            height={30}
            width={30}
            style={{ left: `${position - 0.4}%` }}
          />
        </ProgressIndicator>
      </ProgressBar>
    </div>
  );
}
