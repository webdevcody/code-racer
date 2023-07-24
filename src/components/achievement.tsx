"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { tossConfetti } from "@/context/use-confetti";
import { Achievement } from "@/types/achievement";
import { UnlockIcon } from "lucide-react";
import Image from "next/image";
import { Icons } from "./icons";

export const AchievementCard = ({
  achievement,
}: {
  achievement: Pick<Achievement, "image" | "name" | "description"> & {
    unlockedAt: Date;
  };
}) => {
  return (
    <li className="flex items-center justify-between bg-accent p-3 sm:p-4 md:px-6 md:py-3 rounded-sm">
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-xl font-bold">{achievement.name}</h3>
        {achievement.description && (
          <p className="text-sm text-muted-foreground">
            {achievement.description}
          </p>
        )}
        <p className="flex items-center text-xs text-accent-foreground">
          <Icons.trophy className="w-4 h-4 mr-2" />
          <span>
            Unlocked:{" "}
            <time dateTime={achievement.unlockedAt.toISOString()}>
              {achievement.unlockedAt.toLocaleDateString()}
            </time>
          </span>
        </p>
      </div>
      <div className="w-13 h-13 md:w-20 md:h-20">
        <Image
          src={achievement.image}
          width={50}
          height={50}
          alt={`Achievement: ${achievement.name}`}
          className="w-full max-w-full object-cover"
        />
      </div>
    </li>
  );
};

export function AchievementBadge({
  name,
  title,
  description,
  image,
}: Parameters<typeof unlockAchievement>[0]) {
  useEffect(() => {
    unlockAchievement({
      name,
      title,
      description,
      image,
    });
  }, [name, title, description, image]);

  return null;
}

export function unlockAchievement({
  name,
  title,
  description,
  image,
}: {
  name: string;
  title?: string;
  description: string;
  image: string;
}) {
  toast({
    description: (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-lg md:text-xl">
          <UnlockIcon className="text-accent-foreground" />{" "}
          <span className="text-muted-foreground">Unlocked:</span>{" "}
          <span className="text-accent-foreground">{title || name}</span>
        </div>
        <div className="flex items-center gap-8">
          <Image src={image} width={65} height={65} alt={`${name} Badge`} />
          <span>{description}</span>
        </div>
      </div>
    ),
  });
  tossConfetti();
}
