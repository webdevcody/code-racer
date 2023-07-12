import { Achievement } from "@prisma/client";
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
            className="w-6 h-6 object-fill"
            src={achievement.image}
            width={24}
            height={24}
            alt={`Achievement: ${achievement.name}`}
          />
        </HoverCardTrigger>
        <HoverCardContent sideOffset={12} className="p-0">
          <div className="w-full h-36 flex items-center justify-center border-b border-border">
            <Image
              className="w-16 h-16 object-fill"
              src={achievement.image}
              width={64}
              height={64}
              alt={`Achievement: ${achievement.name}`}
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold pb-2">{achievement.name}</h3>
            <p className="text-sm">{achievement.description}</p>
            <div className="border-b border-border w-full my-4" />
            <p className="text-xs text-gray-500 flex items-center gap-2">
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
