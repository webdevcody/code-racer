import { ProgressBar, ProgressIndicator } from "@/components/ui/progress-bar";
import Image from "next/image";
import type { User } from "next-auth";
import React from "react";

export default function RaceTracker({ codeLength, user, position }: {
  position: number;
  user?: User;
  codeLength: number;
}) {
  const getRelativePosition = () => {
    return position * (100 / codeLength);
  };

  return (
    <div className="relative flex items-center mb-5">
      <ProgressBar>
        <ProgressIndicator progress={getRelativePosition()}>
          <Image
            className="absolute left-0 top-[-50%] border-2 border-monochrome rounded-full transition-all duration-100"
            src={
              user?.image ?? "/placeholder-image.jpg"
            }
            alt={
              `${user?.name} avatar` ?? "user avatar"
            }
            height={30}
            width={30}
            style={{ left: `${getRelativePosition()}%` }}
          />
        </ProgressIndicator>
      </ProgressBar>
    </div>
  );
}
