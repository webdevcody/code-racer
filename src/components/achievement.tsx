import { Achievement } from "@/types/achievement";
import Image from "next/image";
import { Icons } from "./icons";

const AchievementCard = ({
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

export default AchievementCard;
