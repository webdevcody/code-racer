import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "next-auth";
import LobbyUser from "./lobby-user";
import { getParticipantUser } from "../actions";
import { bruno_ace_sc } from "@/lib/fonts";

interface MultiplayerLoadingLobbyProps {
  participants: User[];
  children?: React.ReactNode;
}

export default function MultiplayerLoadingLobby({
  participants,
  children,
}: MultiplayerLoadingLobbyProps) {
  const [lobby, setLobby] = useState<User[]>([]);
  const searchParams = useSearchParams();
  const lang = searchParams ? searchParams.get("lang") : "";

  useEffect(() => {
    async function getUsers() {
      const users = await Promise.all(
        participants.map(async (participant) => {
          const userParticipant = await getParticipantUser({
            participantId: participant.id,
          });
          return {
            ...(userParticipant as User),
          };
        }),
      );
      setLobby(users);
    }
    getUsers();
  }, [participants]);

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
        {lobby &&
          lobby.map((participant, idx) => (
            <LobbyUser key={idx} participant={participant} />
          ))}
      </div>
      {children}
    </div>
  );
}
