import { Achievement } from "@/types/achievement";
import Image from "next/image";
import { Icons } from "./icons";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface AchievementProps {
  achievement: Pick<Achievement, "image" | "name" | "description"> & {
    unlockedAt: Date;
  };
}

const Achievement = ({ achievement }: AchievementProps) => {
  return (
    <div>
      <HoverCard openDelay={100}>
        <HoverCardTrigger
          aria-label={`Achievement: ${achievement.name}`}
          role="button"
          tabIndex={0}
        >
          <Image
            className="object-fill w-20 h-20"
            src={achievement.image}
            width={80}
            height={80}
            alt={`Achievement: ${achievement.name}`}
          />
        </HoverCardTrigger>
        <HoverCardContent sideOffset={12} className="p-0">
          <div className="flex items-center justify-center w-full border-b h-36 border-border">
            <Image
              className="object-fill w-16 h-16"
              src={achievement.image}
              width={64}
              height={64}
              alt={`Achievement: ${achievement.name}`}
            />
          </div>
          <div className="p-4">
            <h3 className="pb-2 text-xl font-bold">{achievement.name}</h3>
            <p className="text-sm">{achievement.description}</p>
            <div className="w-full my-4 border-b border-border" />
            <p className="flex items-center gap-2 text-xs text-gray-500">
              <Icons.trophy size="1rem" />
              <span>
                Unlocked on{" "}
                <time>{achievement.unlockedAt.toLocaleDateString()}</time>
              </span>
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default Achievement;
