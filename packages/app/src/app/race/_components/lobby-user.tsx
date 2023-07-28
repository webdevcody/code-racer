import Image from "next/image";
import type { User } from "next-auth";

interface LobbyUserProps {
  participant?: User;
}

export default function LobbyUser({ participant }: LobbyUserProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Image
        className="border-2 border-monochrome rounded-full"
        src={
          // "/placeholder-image.jpg"
          participant?.image ?? participant?.image ?? "/placeholder-image.jpg"
        }
        alt={"user avatar"}
        height={80}
        width={80}
      />
      <p>{participant?.name ?? participant?.name ?? "Guest"}</p>
    </div>
  );
}
