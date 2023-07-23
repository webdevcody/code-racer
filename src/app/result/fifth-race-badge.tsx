"use client";

import { useEffect } from "react";

import { unlockAchievement } from "@/components/achievement";

export function FifthRaceBadge({ image }: { image: string }) {
  useEffect(() => {
    unlockAchievement({
      name: "Fifth Race",
      title: "You are in the Club",
      description:
        "Congrats on completing your fifth race! You will now show up in the leaderboards.",
      image: image,
    });
  }, [image]);

  return null;
}
