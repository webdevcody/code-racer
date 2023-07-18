"use client";

import Image from "next/image";
import { UnlockIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConfettiContext } from "@/context/confetti";

export function FirstRaceBadge({ image }: { image: string }) {
  const { toast } = useToast();
  const confettiCtx = useConfettiContext();

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
  confettiCtx.showConfetti();

  return null;
}
