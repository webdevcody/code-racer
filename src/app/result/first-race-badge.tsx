"use client";

import { useEffect } from "react";

import { unlockAchievement } from "@/components/achievement";

export function FirstRaceBadge({ image }: { image: string }) {
  useEffect(() => {
    unlockAchievement({
      name: "First Race",
      description: "Congrats on completing your first race!",
      image: image,
    });
  }, [image]);

  return null;
}
