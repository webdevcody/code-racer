import { Achievement as AchievementCard } from "@/types/achievement";
import Image from "next/image";
import { Icons } from "./icons";

const AchievementCard = ({
  achievement,
}: {
  achievement: Pick<AchievementCard, "image" | "name" | "description"> & {
    unlockedAt: Date;
  };
}) => {
  return (
    <li className="flex items-center justify-between bg-accent px-6 py-3 rounded-sm">
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-xl font-bold">{achievement.name}</h3>
        <p className="text-sm text-muted-foreground">
          {achievement.description ?? "this is fine"}
        </p>
        <p className="flex items-center text-xs text-accent-foreground">
          <Icons.trophy className="w-4 h-4 mr-2" />
          <span>
            Unlocked: <time>{achievement.unlockedAt.toLocaleDateString()}</time>
          </span>
        </p>
      </div>
      <Image
        src={achievement.image}
        width={50}
        height={50}
        alt={`Achievement: ${achievement.name}`}
        className="h-full w-auto"
      />
    </li>
  );
};

export default AchievementCard;
