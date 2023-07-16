"use client";

import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { UnlockIcon } from "lucide-react";
import { useTimeout } from "react-use";
import Confetti from "react-confetti";

const CONFETTI_TIME = 5_000;

export function FirstRaceBadge({ image }: { image: string }) {
  const [isExpired] = useTimeout(CONFETTI_TIME);

  if (!isExpired()) {
    toast({
      description: (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-lg md:text-xl">
            <UnlockIcon className="text-accent-foreground" />{" "}
            <span className="text-muted-foreground">Unlocked:</span>{" "}
            <span className="text-accent-foreground">First Race</span>
          </div>
          <div className="flex items-center gap-8">
            <Image src={image} width={65} height={65} alt="First Race Badge" />
            <span>Congrats on completing your first race! </span>
          </div>
        </div>
      ),
    });
  }

  return (
    <>
      {!isExpired() && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          gravity={0.4}
        />
      )}
    </>
  );
}
