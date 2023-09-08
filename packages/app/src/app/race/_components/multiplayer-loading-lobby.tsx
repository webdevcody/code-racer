"use client";

import type { Participant } from "@code-racer/wss/src/store/memory";

import { useSearchParams } from "next/navigation";

import { bruno_ace_sc } from "@/lib/fonts";

interface MultiplayerLoadingLobbyProps {
  participants: Array<Participant>;
  children?: React.ReactNode;
}

export function MultiplayerLoadingLobby({
  participants,
  children,
}: MultiplayerLoadingLobbyProps) {
  const searchParams = useSearchParams();
  const lang = searchParams ? searchParams.get("lang") : "";

  return (
    <div className="flex flex-col items-center space-y-10">
      <h2
        style={bruno_ace_sc.style}
        className="text-3xl text-center font-bold text-warning"
      >
        <span>Lobby: </span>
        <span className="dark:text-white text-black">
          {lang?.toUpperCase()}
        </span>
      </h2>
      <div className="flex justify-center space-x-10">
        {/* {lobby && lobby} */}
      </div>
      {children}
    </div>
  );
}
