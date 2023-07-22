"use client";

import Image from "next/image";
// import { UnlockIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConfettiContext } from "@/context/confetti";

export function FifthRaceBadge({ image }: { image: string }) {
  const { toast } = useToast();
  const confettiCtx = useConfettiContext();

  toast({
    description: (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-lg md:text-xl">
          {/* <UnlockIcon className="text-accent-foreground" />{" "} */}
          <span className="text-muted-foreground">Unlocked:</span>{" "}
          <span className="text-accent-foreground">You are in the Club!</span>
        </div>
        <div className="flex items-center gap-8">
          <Image src={image} width={65} height={65} alt="Fifth Race Badge" />
          <span>Congrats on completing your fifth race! You will now show up in the leaderboards.</span>
        </div>
      </div>
    ),
  });
  confettiCtx.showConfetti();

  return null;
}