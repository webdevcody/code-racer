"use client";

import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import Image from "next/image";
import { UnlockIcon } from "lucide-react";

export function FirstRaceBadge({ image }: { image: string | null }) {
  const [display, setDisplay] = useState<boolean>();

  useEffect(() => {
    setDisplay(!!image);

    const timer = setTimeout(() => {
      setDisplay(false);
    }, 10_000);

    return () => {
      clearTimeout(timer);
    };
  }, [image]);

  if (display) {
    toast({
      description: (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 text-xl items-center">
            <UnlockIcon className="text-accent-foreground" />{" "}
            <span className="text-muted-foreground">Unlocked:</span>{" "}
            <span className="text-accent-foreground">First Race</span>
          </div>
          <Image
            src={image ?? ""}
            width={65}
            height={65}
            alt="First Race Badge"
          />
        </div>
      ),
    });
  }

  return (
    display && (
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={200}
        gravity={0.2}
      />
    )
  );
}
